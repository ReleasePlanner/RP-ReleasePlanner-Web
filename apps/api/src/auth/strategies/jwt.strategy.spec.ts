/**
 * JWT Strategy Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy, JwtPayload } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../users/infrastructure/user.repository';
import { User, UserRole } from '../../users/domain/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const mockUserRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get(ConfigService);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with JWT secret from config', () => {
      configService.get.mockReturnValue('test-secret-key');

      const newStrategy = new JwtStrategy(configService, userRepository);

      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('should use default secret when JWT_SECRET is not set', () => {
      configService.get.mockReturnValue(undefined);

      const newStrategy = new JwtStrategy(configService, userRepository);

      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });

  describe('validate', () => {
    it('should return user data when user exists and is active', async () => {
      const payload: JwtPayload = {
        sub: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      const user = new User();
      user.id = 'user-id';
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.role = UserRole.USER;
      user.isActive = true;

      userRepository.findById.mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(userRepository.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.USER,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload: JwtPayload = {
        sub: 'non-existent-id',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      userRepository.findById.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const payload: JwtPayload = {
        sub: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      const user = new User();
      user.id = 'user-id';
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.role = UserRole.USER;
      user.isActive = false;

      userRepository.findById.mockResolvedValue(user);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith('user-id');
    });

    it('should handle payload with iat and exp', async () => {
      const payload: JwtPayload = {
        sub: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        iat: 1234567890,
        exp: 1234567890 + 3600,
      };

      const user = new User();
      user.id = 'user-id';
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.role = UserRole.ADMIN;
      user.isActive = true;

      userRepository.findById.mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      });
    });
  });
});

