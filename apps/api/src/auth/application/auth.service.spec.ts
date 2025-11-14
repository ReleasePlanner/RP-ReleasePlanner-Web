/**
 * Auth Service Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../../users/infrastructure/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../../users/domain/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when username and password are valid', async () => {
      const user = new User();
      user.id = 'user-id';
      user.username = 'testuser';
      user.password = 'hashed-password';
      user.isActive = true;

      userRepository.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');

      expect(userRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(result).toEqual(user);
    });

    it('should return null when username is not found', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');

      expect(result).toBeNull();
    });

    it('should try email when username is not found', async () => {
      const user = new User();
      user.id = 'user-id';
      user.email = 'test@example.com';
      user.password = 'hashed-password';
      user.isActive = true;

      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null when password is invalid', async () => {
      const user = new User();
      user.id = 'user-id';
      user.username = 'testuser';
      user.password = 'hashed-password';
      user.isActive = true;

      userRepository.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null when user is inactive', async () => {
      const user = new User();
      user.id = 'user-id';
      user.username = 'testuser';
      user.password = 'hashed-password';
      user.isActive = false;

      userRepository.findByUsername.mockResolvedValue(user);

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const user = new User();
      user.id = 'user-id';
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.password = 'hashed-password';
      user.role = UserRole.USER;
      user.isActive = true;

      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      userRepository.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('access-token');
      configService.get.mockReturnValue('15m');
      userRepository.update.mockResolvedValue(user);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.id).toBe('user-id');
      expect(userRepository.update).toHaveBeenCalledWith('user-id', expect.objectContaining({
        lastLoginAt: expect.any(Date),
      }));
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const user = new User();
      user.id = 'user-id';
      Object.assign(user, registerDto);
      user.role = UserRole.USER;
      user.isActive = true;

      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('token');
      configService.get.mockReturnValue('10');
      userRepository.update.mockResolvedValue(user);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.username).toBe('newuser');
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when username exists', async () => {
      const registerDto: RegisterDto = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'password123',
      };

      const existingUser = new User();
      userRepository.findByUsername.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when email exists', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
      };

      userRepository.findByUsername.mockResolvedValue(null);
      const existingUser = new User();
      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should use default role when not provided', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      const user = new User();
      user.id = 'user-id';
      Object.assign(user, registerDto);
      user.role = UserRole.USER;

      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('token');
      configService.get.mockReturnValue('10');
      userRepository.update.mockResolvedValue(user);

      await service.register(registerDto);

      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.USER }),
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 'user-id', username: 'testuser', email: 'test@example.com', role: UserRole.USER };

      const user = new User();
      user.id = 'user-id';
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.role = UserRole.USER;
      user.isActive = true;
      user.refreshToken = 'hashed-refresh-token';
      user.refreshTokenExpiresAt = new Date(Date.now() + 86400000); // Tomorrow

      jwtService.verify.mockReturnValue(payload);
      configService.get.mockReturnValue('refresh-secret');
      userRepository.findById.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('new-token');
      userRepository.update.mockResolvedValue(user);

      const result = await service.refreshToken(refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(userRepository.update).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload = { sub: 'non-existent-id' };
      jwtService.verify.mockReturnValue(payload);
      configService.get.mockReturnValue('refresh-secret');
      userRepository.findById.mockResolvedValue(null);

      await expect(service.refreshToken('token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const payload = { sub: 'user-id' };
      const user = new User();
      user.id = 'user-id';
      user.isActive = false;

      jwtService.verify.mockReturnValue(payload);
      configService.get.mockReturnValue('refresh-secret');
      userRepository.findById.mockResolvedValue(user);

      await expect(service.refreshToken('token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh token does not match', async () => {
      const payload = { sub: 'user-id' };
      const user = new User();
      user.id = 'user-id';
      user.isActive = true;
      user.refreshToken = 'different-hashed-token';
      user.refreshTokenExpiresAt = new Date(Date.now() + 86400000);

      jwtService.verify.mockReturnValue(payload);
      configService.get.mockReturnValue('refresh-secret');
      userRepository.findById.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.refreshToken('token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh token is expired', async () => {
      const payload = { sub: 'user-id' };
      const user = new User();
      user.id = 'user-id';
      user.isActive = true;
      user.refreshToken = 'hashed-token';
      user.refreshTokenExpiresAt = new Date(Date.now() - 86400000); // Yesterday

      jwtService.verify.mockReturnValue(payload);
      configService.get.mockReturnValue('refresh-secret');
      userRepository.findById.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.refreshToken('token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const user = new User();
      user.id = 'user-id';

      userRepository.update.mockResolvedValue(user);

      await service.logout('user-id');

      expect(userRepository.update).toHaveBeenCalledWith('user-id', {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      });
    });
  });
});

