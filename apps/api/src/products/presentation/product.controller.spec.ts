/**
 * Product Controller Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../application/product.service';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { ProductResponseDto } from '../application/dto/product-response.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('ProductController', () => {
  let controller: ProductController;
  let service: jest.Mocked<ProductService>;

  const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of ProductResponseDto', async () => {
      const mockResponse: ProductResponseDto[] = [
        {
          id: 'id1',
          name: 'Product 1',
          components: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockResponse);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a ProductResponseDto', async () => {
      const mockResponse: ProductResponseDto = {
        id: 'id1',
        name: 'Product 1',
        components: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(mockResponse);

      const result = await controller.findById('id1');

      expect(result).toEqual(mockResponse);
      expect(service.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when product does not exist', async () => {
      service.findById.mockRejectedValue(new NotFoundException('Product', 'non-existent'));

      await expect(controller.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateProductDto = {
      name: 'New Product',
    };

    it('should create and return a ProductResponseDto', async () => {
      const mockResponse: ProductResponseDto = {
        id: 'new-id',
        name: 'New Product',
        components: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.create.mockResolvedValue(mockResponse);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResponse);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException when name already exists', async () => {
      service.create.mockRejectedValue(
        new ConflictException('Product with name "New Product" already exists', 'DUPLICATE_PRODUCT_NAME'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateProductDto = {
      name: 'Updated Product',
    };

    it('should update and return a ProductResponseDto', async () => {
      const mockResponse: ProductResponseDto = {
        id: 'id1',
        name: 'Updated Product',
        components: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(mockResponse);

      const result = await controller.update('id1', updateDto);

      expect(result).toEqual(mockResponse);
      expect(service.update).toHaveBeenCalledWith('id1', updateDto);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      service.update.mockRejectedValue(new NotFoundException('Product', 'non-existent'));

      await expect(controller.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('id1');

      expect(service.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when product does not exist', async () => {
      service.delete.mockRejectedValue(new NotFoundException('Product', 'non-existent'));

      await expect(controller.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});

