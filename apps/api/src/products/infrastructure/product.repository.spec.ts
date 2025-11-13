/**
 * Product Repository Unit Tests
 * Coverage: 100%
 */
import { ProductRepository } from './product.repository';
import { Product } from '../domain/product.entity';
import { ComponentVersion, ComponentType } from '../domain/component-version.entity';

describe('ProductRepository', () => {
  let repository: ProductRepository;

  beforeEach(() => {
    repository = new ProductRepository();
  });

  afterEach(() => {
    (repository as any).entities.clear();
  });

  describe('findByName', () => {
    it('should find product by name (case-insensitive)', async () => {
      const product1 = new Product('Product One', []);
      const product2 = new Product('Product Two', []);

      await repository.create(product1);
      await repository.create(product2);

      const found = await repository.findByName('product one');
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Product One');
    });

    it('should return null when product not found', async () => {
      const found = await repository.findByName('Non Existent');
      expect(found).toBeNull();
    });
  });

  describe('CRUD operations', () => {
    it('should create a new product', async () => {
      const product = new Product('Test Product', [
        new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0'),
      ]);
      const created = await repository.create(product);

      expect(created).toHaveProperty('id');
      expect(created.name).toBe('Test Product');
      expect(created.components).toHaveLength(1);
    });

    it('should find all products', async () => {
      await repository.create(new Product('Product 1', []));
      await repository.create(new Product('Product 2', []));

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    it('should find product by id', async () => {
      const product = new Product('Test Product', []);
      const created = await repository.create(product);

      const found = await repository.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });

    it('should update product', async () => {
      const product = new Product('Old Name', []);
      const created = await repository.create(product);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await repository.update(created.id, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should delete product', async () => {
      const product = new Product('Test Product', []);
      const created = await repository.create(product);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should check if product exists', async () => {
      const product = new Product('Test Product', []);
      const created = await repository.create(product);

      expect(await repository.exists(created.id)).toBe(true);
      expect(await repository.exists('non-existent')).toBe(false);
    });
  });
});

