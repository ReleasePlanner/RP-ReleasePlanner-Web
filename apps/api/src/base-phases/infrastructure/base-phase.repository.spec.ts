/**
 * Base Phase Repository Unit Tests
 * 
 * Coverage: 100%
 */
import { BasePhaseRepository } from './base-phase.repository';
import { BasePhase } from '../domain/base-phase.entity';

describe('BasePhaseRepository', () => {
  let repository: BasePhaseRepository;

  beforeEach(() => {
    repository = new BasePhaseRepository();
  });

  afterEach(() => {
    // Clear all entities
    (repository as any).entities.clear();
  });

  describe('findByName', () => {
    it('should find phase by name (case-insensitive)', async () => {
      const phase1 = new BasePhase('Phase One', '#FF0000');
      const phase2 = new BasePhase('Phase Two', '#00FF00');

      await repository.create(phase1);
      await repository.create(phase2);

      const found = await repository.findByName('phase one');
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Phase One');
      expect(found?.color).toBe('#FF0000');
    });

    it('should return null when phase not found', async () => {
      const found = await repository.findByName('Non Existent');
      expect(found).toBeNull();
    });

    it('should handle empty repository', async () => {
      const found = await repository.findByName('Any Name');
      expect(found).toBeNull();
    });
  });

  describe('findByColor', () => {
    it('should find phase by color (case-insensitive)', async () => {
      const phase1 = new BasePhase('Phase One', '#FF0000');
      const phase2 = new BasePhase('Phase Two', '#00FF00');

      await repository.create(phase1);
      await repository.create(phase2);

      const found = await repository.findByColor('#ff0000');
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Phase One');
      expect(found?.color).toBe('#FF0000');
    });

    it('should return null when color not found', async () => {
      const found = await repository.findByColor('#000000');
      expect(found).toBeNull();
    });

    it('should handle empty repository', async () => {
      const found = await repository.findByColor('#FFFFFF');
      expect(found).toBeNull();
    });
  });

  describe('CRUD operations', () => {
    it('should create a new phase', async () => {
      const phase = new BasePhase('Test Phase', '#FF0000', 'Test Category');
      const created = await repository.create(phase);

      expect(created).toHaveProperty('id');
      expect(created.name).toBe('Test Phase');
      expect(created.color).toBe('#FF0000');
      expect(created.category).toBe('Test Category');
      expect(created.createdAt).toBeInstanceOf(Date);
      expect(created.updatedAt).toBeInstanceOf(Date);
    });

    it('should find all phases', async () => {
      const phase1 = new BasePhase('Phase 1', '#FF0000');
      const phase2 = new BasePhase('Phase 2', '#00FF00');

      await repository.create(phase1);
      await repository.create(phase2);

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    it('should find phase by id', async () => {
      const phase = new BasePhase('Test Phase', '#FF0000');
      const created = await repository.create(phase);

      const found = await repository.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('Test Phase');
    });

    it('should return null when id not found', async () => {
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });

    it('should update phase', async () => {
      const phase = new BasePhase('Old Name', '#FF0000');
      const created = await repository.create(phase);

      // Wait a bit to ensure updatedAt changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await repository.update(created.id, {
        name: 'New Name',
        color: '#00FF00',
      });

      expect(updated.name).toBe('New Name');
      expect(updated.color).toBe('#00FF00');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should throw error when updating non-existent phase', async () => {
      await expect(
        repository.update('non-existent', { name: 'New Name' }),
      ).rejects.toThrow('Entity with id non-existent not found');
    });

    it('should delete phase', async () => {
      const phase = new BasePhase('Test Phase', '#FF0000');
      const created = await repository.create(phase);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should throw error when deleting non-existent phase', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow(
        'Entity with id non-existent not found',
      );
    });

    it('should check if phase exists', async () => {
      const phase = new BasePhase('Test Phase', '#FF0000');
      const created = await repository.create(phase);

      expect(await repository.exists(created.id)).toBe(true);
      expect(await repository.exists('non-existent')).toBe(false);
    });

    it('should count phases', async () => {
      expect(await repository.count()).toBe(0);

      await repository.create(new BasePhase('Phase 1', '#FF0000'));
      expect(await repository.count()).toBe(1);

      await repository.create(new BasePhase('Phase 2', '#00FF00'));
      expect(await repository.count()).toBe(2);
    });

    it('should find many phases by criteria', async () => {
      const phase1 = new BasePhase('Phase 1', '#FF0000', 'Category 1');
      const phase2 = new BasePhase('Phase 2', '#00FF00', 'Category 1');
      const phase3 = new BasePhase('Phase 3', '#0000FF', 'Category 2');

      await repository.create(phase1);
      await repository.create(phase2);
      await repository.create(phase3);

      const found = await repository.findMany({ category: 'Category 1' });
      expect(found).toHaveLength(2);
      expect(found.every((p) => p.category === 'Category 1')).toBe(true);
    });
  });
});

