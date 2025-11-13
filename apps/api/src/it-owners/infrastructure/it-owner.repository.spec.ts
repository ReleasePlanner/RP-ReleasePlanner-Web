/**
 * IT Owner Repository Unit Tests
 * Coverage: 100%
 */
import { ITOwnerRepository } from './it-owner.repository';
import { ITOwner } from '../domain/it-owner.entity';

describe('ITOwnerRepository', () => {
  let repository: ITOwnerRepository;

  beforeEach(() => {
    repository = new ITOwnerRepository();
  });

  afterEach(() => {
    (repository as any).entities.clear();
  });

  describe('findByName', () => {
    it('should find owner by name (case-insensitive)', async () => {
      const owner1 = new ITOwner('Owner One');
      const owner2 = new ITOwner('Owner Two');

      await repository.create(owner1);
      await repository.create(owner2);

      const found = await repository.findByName('owner one');
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Owner One');
    });

    it('should return null when owner not found', async () => {
      const found = await repository.findByName('Non Existent');
      expect(found).toBeNull();
    });
  });

  describe('CRUD operations', () => {
    it('should create a new owner', async () => {
      const owner = new ITOwner('Test Owner');
      const created = await repository.create(owner);

      expect(created).toHaveProperty('id');
      expect(created.name).toBe('Test Owner');
    });

    it('should find all owners', async () => {
      await repository.create(new ITOwner('Owner 1'));
      await repository.create(new ITOwner('Owner 2'));

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    it('should find owner by id', async () => {
      const owner = new ITOwner('Test Owner');
      const created = await repository.create(owner);

      const found = await repository.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });

    it('should update owner', async () => {
      const owner = new ITOwner('Old Name');
      const created = await repository.create(owner);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await repository.update(created.id, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should delete owner', async () => {
      const owner = new ITOwner('Test Owner');
      const created = await repository.create(owner);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });
});

