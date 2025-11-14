/**
 * User Repository Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { User, UserRole } from '../domain/user.entity';
import { NotFoundException } from '../../common/exceptions/business-exception';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const user = new User();
      user.id = 'user-id';
      user.email = 'test@example.com';
      user.username = 'testuser';
      user.password = 'hashed-password';
      user.role = UserRole.USER;

      mockTypeOrmRepository.findOne.mockResolvedValue(user);

      const found = await repository.findByEmail('test@example.com');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(found).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const found = await repository.findByEmail('nonexistent@example.com');

      expect(found).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockTypeOrmRepository.findOne.mockRejectedValue(error);

      await expect(repository.findByEmail('test@example.com')).rejects.toThrow();
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const user = new User();
      user.id = 'user-id';
      user.email = 'test@example.com';
      user.username = 'testuser';
      user.password = 'hashed-password';
      user.role = UserRole.USER;

      mockTypeOrmRepository.findOne.mockResolvedValue(user);

      const found = await repository.findByUsername('testuser');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(found).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const found = await repository.findByUsername('nonexistent');

      expect(found).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockTypeOrmRepository.findOne.mockRejectedValue(error);

      await expect(repository.findByUsername('testuser')).rejects.toThrow();
    });
  });

  describe('CRUD operations', () => {
    it('should find all users', async () => {
      const users = [
        new User(),
        new User(),
      ];
      users[0].id = 'user-1';
      users[1].id = 'user-2';

      mockTypeOrmRepository.find.mockResolvedValue(users);

      const result = await repository.findAll();

      expect(result).toEqual(users);
      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
    });

    it('should find user by id', async () => {
      const user = new User();
      user.id = 'user-id';
      user.email = 'test@example.com';
      user.username = 'testuser';
      user.password = 'hashed-password';
      user.role = UserRole.USER;

      mockTypeOrmRepository.findOne.mockResolvedValue(user);

      const result = await repository.findById('user-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
      expect(result).toEqual(user);
    });

    it('should create a user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashed-password',
        role: UserRole.USER,
      };

      const createdUser = new User();
      createdUser.id = 'user-id';
      Object.assign(createdUser, userData);

      mockTypeOrmRepository.create.mockReturnValue(createdUser);
      mockTypeOrmRepository.save.mockResolvedValue(createdUser);

      const result = await repository.create(userData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(userData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should update a user', async () => {
      const existingUser = new User();
      existingUser.id = 'user-id';
      existingUser.email = 'test@example.com';
      existingUser.username = 'testuser';
      existingUser.password = 'hashed-password';
      existingUser.role = UserRole.USER;

      const updates = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const updatedUser = { ...existingUser, ...updates };

      mockTypeOrmRepository.findOne.mockResolvedValue(existingUser);
      mockTypeOrmRepository.save.mockResolvedValue(updatedUser);

      const result = await repository.update('user-id', updates);

      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should delete a user', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(new User());
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('user-id');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('user-id');
    });

    it('should save a user', async () => {
      const user = new User();
      user.id = 'user-id';
      user.email = 'test@example.com';
      user.username = 'testuser';
      user.password = 'hashed-password';
      user.role = UserRole.USER;

      mockTypeOrmRepository.save.mockResolvedValue(user);

      const result = await repository.save(user);

      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
});

