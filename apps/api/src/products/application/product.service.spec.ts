/**
 * Product Service Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { IProductRepository } from '../infrastructure/product.repository';
import { Product } from '../domain/product.entity';
import { ComponentVersion, ComponentType } from '../domain/component-version.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<IProductRepository>;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'IProductRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of ProductResponseDto', async () => {
      const mockProducts = [
        new Product('Product 1', [new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0')]),
        new Product('Product 2', []),
      ];
      mockProducts[0].id = 'id1';
      mockProducts[1].id = 'id2';

      repository.findAll.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 'id1');
      expect(result[0]).toHaveProperty('name', 'Product 1');
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a ProductResponseDto when product exists', async () => {
      const mockProduct = new Product('Product 1', []);
      mockProduct.id = 'id1';

      repository.findById.mockResolvedValue(mockProduct);

      const result = await service.findById('id1');

      expect(result).toHaveProperty('id', 'id1');
      expect(result).toHaveProperty('name', 'Product 1');
      expect(repository.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when product does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('create', () => {
    const createDto: CreateProductDto = {
      name: 'New Product',
      components: [
        {
          type: ComponentType.WEB,
          currentVersion: '1.0.0',
          previousVersion: '0.9.0',
        },
      ],
    };

    it('should create and return a ProductResponseDto', async () => {
      const mockProduct = new Product(createDto.name, [
        new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0'),
      ]);
      mockProduct.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockProduct);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', 'new-id');
      expect(result).toHaveProperty('name', 'New Product');
      expect(result.components).toHaveLength(1);
      expect(repository.findByName).toHaveBeenCalledWith('New Product');
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when name already exists', async () => {
      const existingProduct = new Product('New Product', []);
      existingProduct.id = 'existing-id';

      repository.findByName.mockResolvedValue(existingProduct);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should create product without components', async () => {
      const createDtoNoComponents: CreateProductDto = {
        name: 'Product Without Components',
      };
      const mockProduct = new Product(createDtoNoComponents.name, []);
      mockProduct.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockProduct);

      const result = await service.create(createDtoNoComponents);

      expect(result.components).toEqual([]);
    });
  });

  describe('update', () => {
    const updateDto: UpdateProductDto = {
      name: 'Updated Product',
    };

    it('should update and return a ProductResponseDto', async () => {
      const existingProduct = new Product('Old Product', []);
      existingProduct.id = 'id1';
      const updatedProduct = new Product('Updated Product', []);
      updatedProduct.id = 'id1';

      repository.findById.mockResolvedValue(existingProduct);
      repository.findByName.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedProduct);

      const result = await service.update('id1', updateDto);

      expect(result).toHaveProperty('name', 'Updated Product');
      expect(repository.findById).toHaveBeenCalledWith('id1');
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new name already exists', async () => {
      const existingProduct = new Product('Old Product', []);
      existingProduct.id = 'id1';
      const conflictingProduct = new Product('Updated Product', []);
      conflictingProduct.id = 'other-id';

      repository.findById.mockResolvedValue(existingProduct);
      repository.findByName.mockResolvedValue(conflictingProduct);

      await expect(service.update('id1', updateDto)).rejects.toThrow(ConflictException);
    });

    it('should update components when provided', async () => {
      const existingProduct = new Product('Product', []);
      existingProduct.id = 'id1';
      const updateDtoWithComponents: UpdateProductDto = {
        components: [
          {
            type: ComponentType.WEB,
            currentVersion: '2.0.0',
            previousVersion: '1.0.0',
          },
        ],
      };

      repository.findById.mockResolvedValue(existingProduct);
      repository.update.mockResolvedValue(existingProduct);

      await service.update('id1', updateDtoWithComponents);

      expect(repository.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      repository.exists.mockResolvedValue(true);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('id1');

      expect(repository.exists).toHaveBeenCalledWith('id1');
      expect(repository.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when product does not exist', async () => {
      repository.exists.mockResolvedValue(false);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});

