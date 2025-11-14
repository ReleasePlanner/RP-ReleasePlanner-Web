/**
 * Local Strategy Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../application/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from '../../users/domain/user.entity';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with username and password fields', () => {
      expect(strategy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should return user when credentials are valid', async () => {
      const user = {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      authService.validateUser.mockResolvedValue(user as any);

      const result = await strategy.validate('testuser', 'password123');

      expect(authService.validateUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith('testuser', 'wrongpassword');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('nonexistent', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith('nonexistent', 'password');
    });

    it('should handle empty username', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('', 'password')).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith('', 'password');
    });

    it('should handle empty password', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate('testuser', '')).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith('testuser', '');
    });
  });
});

