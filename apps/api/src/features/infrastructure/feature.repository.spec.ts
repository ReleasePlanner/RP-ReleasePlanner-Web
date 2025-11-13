/**
 * Feature Repository Unit Tests
 * Coverage: 100%
 */
import { FeatureRepository } from './feature.repository';
import { Feature, FeatureStatus } from '../domain/feature.entity';
import { FeatureCategory } from '../domain/feature-category.entity';
import { ProductOwner } from '../domain/product-owner.entity';

describe('FeatureRepository', () => {
  let repository: FeatureRepository;

  beforeEach(() => {
    repository = new FeatureRepository();
  });

  afterEach(() => {
    (repository as any).entities.clear();
  });

  describe('findByName', () => {
    it('should find feature by name (case-insensitive)', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature1 = new Feature('Feature One', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      const feature2 = new Feature('Feature Two', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');

      await repository.create(feature1);
      await repository.create(feature2);

      const found = await repository.findByName('feature one');
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Feature One');
    });

    it('should return null when feature not found', async () => {
      const found = await repository.findByName('Non Existent');
      expect(found).toBeNull();
    });
  });

  describe('findByProductId', () => {
    it('should find features by product id', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature1 = new Feature('Feature 1', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      const feature2 = new Feature('Feature 2', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-2');

      await repository.create(feature1);
      await repository.create(feature2);

      const found = await repository.findByProductId('prod-1');
      expect(found).toHaveLength(1);
      expect(found[0].productId).toBe('prod-1');
    });
  });

  describe('CRUD operations', () => {
    it('should create a new feature', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature = new Feature('Test Feature', 'Description', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      const created = await repository.create(feature);

      expect(created).toHaveProperty('id');
      expect(created.name).toBe('Test Feature');
    });

    it('should find all features', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      await repository.create(new Feature('Feature 1', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'));
      await repository.create(new Feature('Feature 2', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'));

      const all = await repository.findAll();
      expect(all.length).toBeGreaterThanOrEqual(2);
    });

    it('should find feature by id', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature = new Feature('Test Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      const created = await repository.create(feature);

      const found = await repository.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });

    it('should update feature', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature = new Feature('Old Name', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      const created = await repository.create(feature);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await repository.update(created.id, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should delete feature', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature = new Feature('Test Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      const created = await repository.create(feature);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });
});

