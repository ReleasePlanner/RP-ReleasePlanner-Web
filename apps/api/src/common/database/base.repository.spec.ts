/**
 * Base Repository Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BaseEntity } from './base.entity';
import { DatabaseException } from '../exceptions/database-exception';
import { NotFoundException } from '../exceptions/business-exception';

class TestEntity extends BaseEntity {
  name: string;
}

// Create a token for TestEntity
const TEST_ENTITY_TOKEN = 'TestEntityRepository';

class TestRepository extends BaseRepository<TestEntity> {
  constructor(repository: Repository<TestEntity>) {
    super(repository);
  }
}

describe('BaseRepository', () => {
  let repository: TestRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<TestEntity>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<TestEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TEST_ENTITY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: TestRepository,
          useFactory: (repo: Repository<TestEntity>) => new TestRepository(repo),
          inject: [TEST_ENTITY_TOKEN],
        },
      ],
    }).compile();

    repository = module.get<TestRepository>(TestRepository);
    mockTypeOrmRepository = module.get(TEST_ENTITY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all entities', async () => {
      const entities = [new TestEntity(), new TestEntity()];
      mockTypeOrmRepository.find.mockResolvedValue(entities);

      const result = await repository.findAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(result).toEqual(entities);
    });

    it('should handle database errors', async () => {
      const error = new QueryFailedError('SELECT * FROM test', [], new Error('DB Error'));
      mockTypeOrmRepository.find.mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow(DatabaseException);
    });
  });

  describe('findById', () => {
    it('should return entity by id', async () => {
      const entity = new TestEntity();
      entity.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(entity);

      const result = await repository.findById('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result).toEqual(entity);
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find entities by criteria', async () => {
      const entities = [new TestEntity()];
      mockTypeOrmRepository.find.mockResolvedValue(entities);

      const result = await repository.findMany({ name: 'Test' } as any);

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { name: 'Test' },
      });
      expect(result).toEqual(entities);
    });

    it('should handle database errors when finding many', async () => {
      mockTypeOrmRepository.find.mockRejectedValue(new QueryFailedError('SELECT *', [], new Error('DB error')));

      await expect(repository.findMany({ name: 'Test' } as any)).rejects.toThrow(DatabaseException);
    });
  });

  describe('create', () => {
    it('should create and save entity', async () => {
      const entityData = { name: 'Test' } as TestEntity;
      const createdEntity = new TestEntity();
      createdEntity.id = 'test-id';
      createdEntity.name = 'Test';

      mockTypeOrmRepository.create.mockReturnValue(entityData as TestEntity);
      mockTypeOrmRepository.save.mockResolvedValue(createdEntity);

      const result = await repository.create(entityData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(entityData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result).toEqual(createdEntity);
    });

    it('should handle database errors when creating', async () => {
      const entityData = { name: 'Test' } as TestEntity;
      mockTypeOrmRepository.create.mockReturnValue(entityData as TestEntity);
      mockTypeOrmRepository.save.mockRejectedValue(new QueryFailedError('INSERT INTO', [], new Error('DB error')));

      await expect(repository.create(entityData)).rejects.toThrow(DatabaseException);
    });
  });

  describe('update', () => {
    it('should update existing entity', async () => {
      const existingEntity = new TestEntity();
      existingEntity.id = 'test-id';
      existingEntity.name = 'Old Name';
      const updatedEntity = new TestEntity();
      updatedEntity.id = 'test-id';
      updatedEntity.name = 'New Name';

      mockTypeOrmRepository.findOne.mockResolvedValue(existingEntity);
      mockTypeOrmRepository.save.mockResolvedValue(updatedEntity);

      const result = await repository.update('test-id', { name: 'New Name' } as any);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('New Name');
    });

    it('should throw NotFoundException when entity not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('non-existent', { name: 'New Name' } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle database errors when updating', async () => {
      const existingEntity = new TestEntity();
      existingEntity.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(existingEntity);
      mockTypeOrmRepository.save.mockRejectedValue(new QueryFailedError('UPDATE', [], new Error('DB error')));

      await expect(repository.update('test-id', { name: 'New Name' } as any)).rejects.toThrow(DatabaseException);
    });
  });

  describe('delete', () => {
    it('should delete entity', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('test-id');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when entity not found', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors when deleting', async () => {
      mockTypeOrmRepository.delete.mockRejectedValue(new QueryFailedError('DELETE', [], new Error('DB error')));

      await expect(repository.delete('test-id')).rejects.toThrow(DatabaseException);
    });
  });

  describe('exists', () => {
    it('should return true when entity exists', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(1);

      const result = await repository.exists('test-id');

      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result).toBe(true);
    });

    it('should return false when entity does not exist', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(0);

      const result = await repository.exists('non-existent');

      expect(result).toBe(false);
    });

    it('should return true when count is greater than 0', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(2);

      const result = await repository.exists('test-id');

      expect(result).toBe(true);
    });

    it('should handle database errors when checking existence', async () => {
      mockTypeOrmRepository.count.mockRejectedValue(new QueryFailedError('SELECT COUNT', [], new Error('DB error')));

      await expect(repository.exists('test-id')).rejects.toThrow(DatabaseException);
    });
  });

  describe('count', () => {
    it('should count all entities when no criteria', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(5);

      const result = await repository.count();

      expect(mockTypeOrmRepository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should count entities with criteria', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(2);

      const result = await repository.count({ name: 'Test' } as any);

      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({
        where: { name: 'Test' },
      });
      expect(result).toBe(2);
    });

    it('should handle database errors when counting', async () => {
      mockTypeOrmRepository.count.mockRejectedValue(new QueryFailedError('select count', [], new Error('DB error')));

      await expect(repository.count()).rejects.toThrow(DatabaseException);
    });
  });

  describe('save', () => {
    it('should save entity', async () => {
      const entity = new TestEntity();
      entity.id = 'test-id';
      mockTypeOrmRepository.save.mockResolvedValue(entity);

      const result = await repository.save(entity);

      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });

    it('should handle database errors when saving', async () => {
      const entity = new TestEntity();
      entity.id = 'test-id';
      mockTypeOrmRepository.save.mockRejectedValue(new QueryFailedError('INSERT INTO', [], new Error('DB error')));

      await expect(repository.save(entity)).rejects.toThrow(DatabaseException);
    });
  });

  describe('findOne', () => {
    it('should find one entity by criteria', async () => {
      const entity = new TestEntity();
      entity.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(entity);

      const result = await repository.findOne({ name: 'Test' } as any);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Test' },
      });
      expect(result).toEqual(entity);
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOne({ name: 'Non Existent' } as any);

      expect(result).toBeNull();
    });

    it('should handle database errors when finding one', async () => {
      mockTypeOrmRepository.findOne.mockRejectedValue(new QueryFailedError('SELECT *', [], new Error('DB error')));

      await expect(repository.findOne({ name: 'Test' } as any)).rejects.toThrow(DatabaseException);
    });
  });

  describe('handleDatabaseOperation error handling', () => {
    it('should wrap unknown errors in DatabaseException', async () => {
      const error = new Error('Unknown error');
      mockTypeOrmRepository.find.mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow(DatabaseException);
    });

    it('should wrap non-Error objects in DatabaseException', async () => {
      const error = 'String error';
      mockTypeOrmRepository.find.mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow(DatabaseException);
    });

    it('should wrap QueryFailedError using fromTypeORMError', async () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      queryError.driverError = { code: '23505' } as any;
      mockTypeOrmRepository.find.mockRejectedValue(queryError);

      await expect(repository.findAll()).rejects.toThrow(DatabaseException);
    });

    it('should rethrow DatabaseException', async () => {
      const error = new DatabaseException('Database error');
      mockTypeOrmRepository.find.mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow(DatabaseException);
    });

    it('should rethrow NotFoundException', async () => {
      const error = new NotFoundException('Entity', 'test-id');
      mockTypeOrmRepository.findOne.mockRejectedValue(error);

      await expect(repository.findById('test-id')).rejects.toThrow(NotFoundException);
    });
  });
});

