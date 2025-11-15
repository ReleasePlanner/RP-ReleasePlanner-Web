/**
 * Auth Service
 *
 * Application layer - Business logic for authentication
 */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../../users/infrastructure/user.repository";
import { User, UserRole } from "../../users/domain/user.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { JwtPayload } from "../strategies/jwt.strategy";
import { DatabaseException } from "../../common/exceptions/database-exception";
import {
  validateString,
  validatePassword as validatePasswordInput,
  validateObject,
  validateId,
} from "@rp-release-planner/rp-shared";
import {
  JWT_CONFIG_DEFAULTS,
  BCRYPT_CONFIG_DEFAULTS,
  REFRESH_TOKEN_CONFIG_DEFAULTS,
} from "../constants";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  /**
   * Validate user credentials
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    // Defensive: Validate inputs before database operations
    validateString(username, "Username");
    validatePasswordInput(password);

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      // Try email as fallback
      const userByEmail = await this.userRepository.findByEmail(username);
      if (!userByEmail) {
        return null;
      }
      return this.validatePassword(userByEmail, password);
    }

    return this.validatePassword(user, password);
  }

  /**
   * Validate password against user
   */
  private async validatePassword(
    user: User,
    password: string
  ): Promise<User | null> {
    // Defensive: Validate user object
    validateObject(user, "User");
    validatePasswordInput(password);

    if (!user.isActive) {
      return null;
    }

    // Defensive: Validate user has password hash
    if (!user.password || typeof user.password !== "string") {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Defensive: Validate DTO
    validateObject(loginDto, "LoginDto");
    validateString(loginDto.username, "Username");
    validatePasswordInput(loginDto.password);

    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Defensive: Validate user has required fields
    validateId(user.id, "User");

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    const tokens = await this.generateTokens(user);

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username || "",
        email: user.email || "",
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Register new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Defensive: Validate DTO
    validateObject(registerDto, "RegisterDto");
    validateString(registerDto.username, "Username");
    validateString(registerDto.email, "Email");
    validatePasswordInput(registerDto.password);

    // Normalize username and email (trim whitespace and convert email to lowercase)
    const normalizedUsername = registerDto.username.trim();
    const normalizedEmail = registerDto.email.trim().toLowerCase();

    // Validate normalized values are not empty after trimming
    if (normalizedUsername.length === 0) {
      throw new ConflictException("Username cannot be empty");
    }
    if (normalizedEmail.length === 0) {
      throw new ConflictException("Email cannot be empty");
    }

    // Check if username exists (using normalized value)
    try {
      const existingUsername = await this.userRepository.findByUsername(
        normalizedUsername
      );
      if (existingUsername) {
        throw new ConflictException("Username already exists");
      }
    } catch (error) {
      // If it's already a ConflictException, re-throw it
      if (error instanceof ConflictException) {
        throw error;
      }
      // Log other errors but continue (they might be transient)
      this.logger.warn(
        `Error checking username existence: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Check if email exists (using normalized value)
    try {
      const existingEmail = await this.userRepository.findByEmail(
        normalizedEmail
      );
      if (existingEmail) {
        throw new ConflictException("Email already exists");
      }
    } catch (error) {
      // If it's already a ConflictException, re-throw it
      if (error instanceof ConflictException) {
        throw error;
      }
      // Log other errors but continue (they might be transient)
      this.logger.warn(
        `Error checking email existence: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      parseInt(
        this.configService.get("BCRYPT_ROUNDS") ||
          String(BCRYPT_CONFIG_DEFAULTS.ROUNDS),
        10
      )
    );

    // Create user (using normalized values)
    let user: User;
    try {
      user = await this.userRepository.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        firstName: registerDto.firstName?.trim() || undefined,
        lastName: registerDto.lastName?.trim() || undefined,
        role: registerDto.role || UserRole.USER,
        isActive: true,
      } as Omit<User, "id" | "createdAt" | "updatedAt">);
    } catch (error) {
      // Log the error for debugging
      this.logger.error(
        `Error creating user: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );

      // Handle DatabaseException with unique violation
      if (error instanceof DatabaseException && error.code === "UNIQUE_VIOLATION") {
        const errorMessage = error.message.toLowerCase();
        // Check which field caused the violation
        if (
          errorMessage.includes("username") ||
          errorMessage.includes("users_username")
        ) {
          throw new ConflictException("Username already exists");
        }
        if (
          errorMessage.includes("email") ||
          errorMessage.includes("users_email")
        ) {
          throw new ConflictException("Email already exists");
        }
        throw new ConflictException("Username or email already exists");
      }

      // Check for HttpException with CONFLICT status (already converted)
      if (
        error instanceof ConflictException ||
        (error &&
          typeof error === "object" &&
          "getStatus" in error &&
          typeof (error as any).getStatus === "function" &&
          (error as any).getStatus() === 409)
      ) {
        throw error;
      }

      // Check for QueryFailedError or error messages indicating unique violation
      if (
        error instanceof Error &&
        (error.message.includes("unique") ||
          error.message.includes("duplicate") ||
          error.message.includes("23505") ||
          error.message.includes("UNIQUE_VIOLATION"))
      ) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("username") ||
          errorMessage.includes("users_username")
        ) {
          throw new ConflictException("Username already exists");
        }
        if (
          errorMessage.includes("email") ||
          errorMessage.includes("users_email")
        ) {
          throw new ConflictException("Email already exists");
        }
        throw new ConflictException("Username or email already exists");
      }

      // Re-throw other errors (they will be handled by the global exception filter)
      throw error;
    }

    // Validate user was created successfully
    if (!user || !user.id) {
      this.logger.error("User creation failed: User object is invalid", {
        user,
        hasId: !!user?.id,
      });
      throw new Error("Failed to create user: User was not created properly");
    }

    // Generate tokens
    let tokens: { accessToken: string; refreshToken: string };
    try {
      tokens = await this.generateTokens(user);
      if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
        throw new Error("Failed to generate tokens: Invalid token response");
      }
    } catch (error) {
      this.logger.error(
        `Error generating tokens for user ${user.id}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      // Try to clean up the created user if token generation fails
      try {
        await this.userRepository.delete(user.id);
        this.logger.warn(`Cleaned up user ${user.id} after token generation failure`);
      } catch (cleanupError) {
        this.logger.error(
          `Failed to clean up user ${user.id} after token generation failure`,
          cleanupError instanceof Error ? cleanupError.stack : undefined
        );
      }
      throw error;
    }

    // Store refresh token
    try {
      await this.storeRefreshToken(user.id, tokens.refreshToken);
    } catch (error) {
      this.logger.error(
        `Error storing refresh token for user ${user.id}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined
      );
      // Don't fail registration if refresh token storage fails, but log it
      // The user can still login and get a new refresh token
    }

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    // Defensive: Validate refresh token input
    validateString(refreshToken, "Refresh token");

    try {
      const secret =
        this.configService.get<string>("JWT_REFRESH_SECRET") ||
        JWT_CONFIG_DEFAULTS.REFRESH_SECRET;
      if (!secret) {
        throw new UnauthorizedException("Refresh token secret not configured");
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret,
      });

      // Defensive: Validate payload
      if (!payload || !payload.sub) {
        throw new UnauthorizedException("Invalid token payload");
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException("User not found or inactive");
      }

      // Defensive: Validate user has refresh token
      if (!user.refreshToken || typeof user.refreshToken !== "string") {
        throw new UnauthorizedException("No refresh token stored for user");
      }

      // Verify stored refresh token matches
      const isTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken
      );

      if (
        !isTokenValid ||
        !user.refreshTokenExpiresAt ||
        user.refreshTokenExpiresAt < new Date()
      ) {
        throw new UnauthorizedException("Invalid or expired refresh token");
      }

      const tokens = await this.generateTokens(user);

      // Update refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Defensive: Validate user object
    validateObject(user, "User");
    validateId(user.id, "User");
    validateString(user.username, "Username");
    validateString(user.email, "Email");

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessTokenExpiresIn =
      this.configService.get<string>("JWT_EXPIRES_IN") ||
      JWT_CONFIG_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN;
    const refreshTokenExpiresIn =
      this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") ||
      JWT_CONFIG_DEFAULTS.REFRESH_TOKEN_EXPIRES_IN;
    const refreshSecret =
      this.configService.get<string>("JWT_REFRESH_SECRET") ||
      JWT_CONFIG_DEFAULTS.REFRESH_SECRET;

    // Defensive: Validate configuration (should not happen with defaults, but check anyway)
    if (!refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET is not configured");
    }

    const accessTokenOptions = {
      expiresIn: accessTokenExpiresIn,
    } as Partial<JwtSignOptions>;

    const refreshTokenOptions = {
      expiresIn: refreshTokenExpiresIn,
      secret: refreshSecret,
    } as Partial<JwtSignOptions> & { secret: string };

    const accessToken = this.jwtService.sign(payload, accessTokenOptions);
    const refreshToken = this.jwtService.sign(payload, refreshTokenOptions);

    // Defensive: Validate tokens were generated
    if (!accessToken || !refreshToken) {
      throw new Error("Failed to generate tokens");
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Store refresh token (hashed) in database
   */
  private async storeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    // Defensive: Validate inputs
    validateId(userId, "User");
    validateString(refreshToken, "Refresh token");

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      BCRYPT_CONFIG_DEFAULTS.REFRESH_TOKEN_ROUNDS
    );
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + REFRESH_TOKEN_CONFIG_DEFAULTS.EXPIRATION_DAYS
    );

    // Defensive: Validate hash was created
    if (!hashedRefreshToken) {
      throw new Error("Failed to hash refresh token");
    }

    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt: expiresAt,
    });
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(userId: string): Promise<void> {
    // Defensive: Validate user ID
    validateId(userId, "User");

    await this.userRepository.update(userId, {
      refreshToken: undefined,
      refreshTokenExpiresAt: undefined,
    });
  }
}
