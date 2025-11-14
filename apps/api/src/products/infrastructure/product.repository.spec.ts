/**
 * Product Repository Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from './product.repository';
import { Product } from '../domain/product.entity';
import { ComponentVersion, ComponentType } from '../domain/component-version.entity';
import { NotFoundException } from '../../common/exceptions/business-exception';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<Product>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByName', () => {
    it('should find product by name', async () => {
      const product = new Product('Product One');
      product.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(product);

      const result = await repository.findByName('Product One');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Product One' },
      });
      expect(result).toEqual(product);
    });

    it('should return null when product not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByName('Non Existent');

      expect(result).toBeNull();
    });
  });

  describe('findWithComponents', () => {
    it('should find product with components', async () => {
      const component = new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0');
      const product = new Product('Product', [component]);
      product.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(product);

      const result = await repository.findWithComponents('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['components'],
      });
      expect(result).toEqual(product);
    });

    it('should return null when product not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findWithComponents('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should use findWithComponents', async () => {
      const component = new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0');
      const product = new Product('Product', [component]);
      product.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(product);

      const result = await repository.findById('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['components'],
      });
      expect(result).toEqual(product);
    });
  });

  describe('CRUD operations', () => {
    it('should create a new product', async () => {
      const productData = { name: 'Test Product' } as Product;
      const savedProduct = new Product('Test Product');
      savedProduct.id = 'test-id';

      mockTypeOrmRepository.create.mockReturnValue(productData as Product);
      mockTypeOrmRepository.save.mockResolvedValue(savedProduct);

      const created = await repository.create(productData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(productData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(created).toEqual(savedProduct);
    });

    it('should find all products', async () => {
      const products = [new Product('Product 1'), new Product('Product 2')];
      mockTypeOrmRepository.find.mockResolvedValue(products);

      const result = await repository.findAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });

    it('should update product', async () => {
      const existingProduct = new Product('Old Name');
      existingProduct.id = 'test-id';
      const updatedProduct = new Product('New Name');
      updatedProduct.id = 'test-id';

      mockTypeOrmRepository.findOne.mockResolvedValue(existingProduct);
      mockTypeOrmRepository.save.mockResolvedValue(updatedProduct);

      const result = await repository.update('test-id', { name: 'New Name' } as any);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('New Name');
    });

    it('should throw error when updating non-existent product', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('non-existent', { name: 'New Name' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should delete product', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('test-id');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error when deleting non-existent product', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
