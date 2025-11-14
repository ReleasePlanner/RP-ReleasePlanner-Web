/**
 * Auth Controller Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { RegisterDto } from '../application/dto/register.dto';
import { AuthResponseDto } from '../application/dto/auth-response.dto';
import { CurrentUserPayload } from '../decorators/current-user.decorator';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const authResponse: AuthResponseDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-id',
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      authService.register.mockResolvedValue(authResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(authResponse);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const authResponse: AuthResponseDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-id',
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      authService.login.mockResolvedValue(authResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(authResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token', async () => {
      const refreshToken = 'refresh-token-string';

      const authResponse: AuthResponseDto = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: 'user-id',
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      authService.refreshToken.mockResolvedValue(authResponse);

      const result = await controller.refreshToken(refreshToken);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual(authResponse);
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const user: CurrentUserPayload = {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      authService.logout.mockResolvedValue(undefined);

      await controller.logout(user);

      expect(authService.logout).toHaveBeenCalledWith('user-id');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user information', async () => {
      const user: CurrentUserPayload = {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      const result = await controller.getCurrentUser(user);

      expect(result).toEqual(user);
    });
  });
});

