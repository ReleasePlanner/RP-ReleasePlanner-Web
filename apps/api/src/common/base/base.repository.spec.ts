/**
 * Base Repository Unit Tests
 * 
 * Coverage: 100%
 */
import { BaseRepository } from './base.repository';
import { BaseEntity } from './base.entity';

// Create a concrete implementation for testing
class TestEntity extends BaseEntity {
  name: string;
  value: number;

  constructor(name: string, value: number) {
    super();
    this.name = name;
    this.value = value;
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Name is required');
    }
  }
}

class TestRepository extends BaseRepository<TestEntity> {}

describe('BaseRepository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
  });

  afterEach(() => {
    (repository as any).entities.clear();
  });

  describe('create', () => {
    it('should create an entity with generated id', async () => {
      const entityData = { name: 'Test', value: 10 } as TestEntity;
      const created = await repository.create(entityData);

      expect(created).toHaveProperty('id');
      expect(created.id).not.toBe('');
      expect(created.name).toBe('Test');
      expect(created.value).toBe(10);
      expect(created.createdAt).toBeInstanceOf(Date);
      expect(created.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate unique ids', async () => {
      const entity1 = await repository.create({ name: 'Test1', value: 1 } as TestEntity);
      const entity2 = await repository.create({ name: 'Test2', value: 2 } as TestEntity);

      expect(entity1.id).not.toBe(entity2.id);
    });

    it('should set createdAt and updatedAt', async () => {
      const before = new Date();
      const created = await repository.create({ name: 'Test', value: 10 } as TestEntity);
      const after = new Date();

      expect(created.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(created.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(created.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(created.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('findAll', () => {
    it('should return all entities', async () => {
      await repository.create({ name: 'Test1', value: 1 } as TestEntity);
      await repository.create({ name: 'Test2', value: 2 } as TestEntity);

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    it('should return empty array when no entities exist', async () => {
      const all = await repository.findAll();
      expect(all).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find entity by id', async () => {
      const created = await repository.create({ name: 'Test', value: 10 } as TestEntity);
      const found = await repository.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('Test');
    });

    it('should return null when id not found', async () => {
      const found = await repository.findById('non-existent');
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('should update entity', async () => {
      const created = await repository.create({ name: 'Old', value: 10 } as TestEntity);
      const oldUpdatedAt = created.updatedAt;

      // Wait a bit to ensure updatedAt changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await repository.update(created.id, { name: 'New' });

      expect(updated.name).toBe('New');
      expect(updated.value).toBe(10); // Unchanged
      expect(updated.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it('should throw error when updating non-existent entity', async () => {
      await expect(
        repository.update('non-existent', { name: 'New' }),
      ).rejects.toThrow('Entity with id non-existent not found');
    });
  });

  describe('delete', () => {
    it('should delete entity', async () => {
      const created = await repository.create({ name: 'Test', value: 10 } as TestEntity);
      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should throw error when deleting non-existent entity', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow(
        'Entity with id non-existent not found',
      );
    });
  });

  describe('exists', () => {
    it('should return true when entity exists', async () => {
      const created = await repository.create({ name: 'Test', value: 10 } as TestEntity);
      expect(await repository.exists(created.id)).toBe(true);
    });

    it('should return false when entity does not exist', async () => {
      expect(await repository.exists('non-existent')).toBe(false);
    });
  });

  describe('count', () => {
    it('should return count of all entities', async () => {
      expect(await repository.count()).toBe(0);

      await repository.create({ name: 'Test1', value: 1 } as TestEntity);
      expect(await repository.count()).toBe(1);

      await repository.create({ name: 'Test2', value: 2 } as TestEntity);
      expect(await repository.count()).toBe(2);
    });

    it('should return count with criteria', async () => {
      await repository.create({ name: 'Test1', value: 10 } as TestEntity);
      await repository.create({ name: 'Test2', value: 20 } as TestEntity);
      await repository.create({ name: 'Test3', value: 10 } as TestEntity);

      const count = await repository.count({ value: 10 } as Partial<TestEntity>);
      expect(count).toBe(2);
    });
  });

  describe('findMany', () => {
    it('should find entities matching criteria', async () => {
      await repository.create({ name: 'Test1', value: 10 } as TestEntity);
      await repository.create({ name: 'Test2', value: 20 } as TestEntity);
      await repository.create({ name: 'Test3', value: 10 } as TestEntity);

      const found = await repository.findMany({ value: 10 } as Partial<TestEntity>);
      expect(found).toHaveLength(2);
      expect(found.every((e) => e.value === 10)).toBe(true);
    });

    it('should return empty array when no matches', async () => {
      await repository.create({ name: 'Test1', value: 10 } as TestEntity);

      const found = await repository.findMany({ value: 99 } as Partial<TestEntity>);
      expect(found).toEqual([]);
    });

    it('should match multiple criteria', async () => {
      await repository.create({ name: 'Test1', value: 10 } as TestEntity);
      await repository.create({ name: 'Test2', value: 10 } as TestEntity);
      await repository.create({ name: 'Test1', value: 20 } as TestEntity);

      const found = await repository.findMany({
        name: 'Test1',
        value: 10,
      } as Partial<TestEntity>);

      expect(found).toHaveLength(1);
      expect(found[0].name).toBe('Test1');
      expect(found[0].value).toBe(10);
    });
  });
});

