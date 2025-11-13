/**
 * Feature Controller Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureController } from './feature.controller';
import { FeatureService } from '../application/feature.service';
import { CreateFeatureDto } from '../application/dto/create-feature.dto';
import { UpdateFeatureDto } from '../application/dto/update-feature.dto';
import { FeatureResponseDto } from '../application/dto/feature-response.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('FeatureController', () => {
  let controller: FeatureController;
  let service: jest.Mocked<FeatureService>;

  const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByProductId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureController],
      providers: [
        {
          provide: FeatureService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FeatureController>(FeatureController);
    service = module.get(FeatureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all features when no productId query', async () => {
      const mockResponse: FeatureResponseDto[] = [
        {
          id: 'id1',
          name: 'Feature 1',
          description: 'Desc',
          category: { id: 'cat1', name: 'Category', createdAt: new Date(), updatedAt: new Date() },
          status: 'planned' as any,
          createdBy: { id: 'owner1', name: 'Owner', createdAt: new Date(), updatedAt: new Date() },
          technicalDescription: 'Tech',
          businessDescription: 'Biz',
          productId: 'prod-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockResponse);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findByProductId).not.toHaveBeenCalled();
    });

    it('should return features filtered by productId', async () => {
      const mockResponse: FeatureResponseDto[] = [
        {
          id: 'id1',
          name: 'Feature 1',
          description: 'Desc',
          category: { id: 'cat1', name: 'Category', createdAt: new Date(), updatedAt: new Date() },
          status: 'planned' as any,
          createdBy: { id: 'owner1', name: 'Owner', createdAt: new Date(), updatedAt: new Date() },
          technicalDescription: 'Tech',
          businessDescription: 'Biz',
          productId: 'prod-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.findByProductId.mockResolvedValue(mockResponse);

      const result = await controller.findAll('prod-1');

      expect(result).toEqual(mockResponse);
      expect(service.findByProductId).toHaveBeenCalledWith('prod-1');
      expect(service.findAll).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a FeatureResponseDto', async () => {
      const mockResponse: FeatureResponseDto = {
        id: 'id1',
        name: 'Feature 1',
        description: 'Desc',
        category: { id: 'cat1', name: 'Category', createdAt: new Date(), updatedAt: new Date() },
        status: 'planned' as any,
        createdBy: { id: 'owner1', name: 'Owner', createdAt: new Date(), updatedAt: new Date() },
        technicalDescription: 'Tech',
        businessDescription: 'Biz',
        productId: 'prod-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(mockResponse);

      const result = await controller.findById('id1');

      expect(result).toEqual(mockResponse);
      expect(service.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      service.findById.mockRejectedValue(new NotFoundException('Feature', 'non-existent'));

      await expect(controller.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateFeatureDto = {
      name: 'New Feature',
      description: 'Description',
      category: { name: 'Category' },
      status: 'planned' as any,
      createdBy: { name: 'Owner' },
      technicalDescription: 'Tech',
      businessDescription: 'Biz',
      productId: 'prod-1',
    };

    it('should create and return a FeatureResponseDto', async () => {
      const mockResponse: FeatureResponseDto = {
        id: 'new-id',
        name: 'New Feature',
        description: 'Description',
        category: { id: 'cat1', name: 'Category', createdAt: new Date(), updatedAt: new Date() },
        status: 'planned' as any,
        createdBy: { id: 'owner1', name: 'Owner', createdAt: new Date(), updatedAt: new Date() },
        technicalDescription: 'Tech',
        businessDescription: 'Biz',
        productId: 'prod-1',
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
        new ConflictException('Feature with name "New Feature" already exists', 'DUPLICATE_FEATURE_NAME'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateFeatureDto = {
      name: 'Updated Feature',
    };

    it('should update and return a FeatureResponseDto', async () => {
      const mockResponse: FeatureResponseDto = {
        id: 'id1',
        name: 'Updated Feature',
        description: 'Desc',
        category: { id: 'cat1', name: 'Category', createdAt: new Date(), updatedAt: new Date() },
        status: 'planned' as any,
        createdBy: { id: 'owner1', name: 'Owner', createdAt: new Date(), updatedAt: new Date() },
        technicalDescription: 'Tech',
        businessDescription: 'Biz',
        productId: 'prod-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(mockResponse);

      const result = await controller.update('id1', updateDto);

      expect(result).toEqual(mockResponse);
      expect(service.update).toHaveBeenCalledWith('id1', updateDto);
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      service.update.mockRejectedValue(new NotFoundException('Feature', 'non-existent'));

      await expect(controller.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete feature successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('id1');

      expect(service.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      service.delete.mockRejectedValue(new NotFoundException('Feature', 'non-existent'));

      await expect(controller.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});

