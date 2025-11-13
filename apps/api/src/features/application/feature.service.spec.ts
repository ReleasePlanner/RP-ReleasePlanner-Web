/**
 * Feature Service Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureService } from './feature.service';
import { IFeatureRepository } from '../infrastructure/feature.repository';
import { Feature, FeatureStatus } from '../domain/feature.entity';
import { FeatureCategory } from '../domain/feature-category.entity';
import { ProductOwner } from '../domain/product-owner.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('FeatureService', () => {
  let service: FeatureService;
  let repository: jest.Mocked<IFeatureRepository>;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByProductId: jest.fn(),
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
        FeatureService,
        {
          provide: 'IFeatureRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    repository = module.get('IFeatureRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of FeatureResponseDto', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const mockFeatures = [
        new Feature('Feature 1', 'Desc 1', category, FeatureStatus.PLANNED, owner, 'Tech 1', 'Biz 1', 'prod-1'),
      ];
      mockFeatures[0].id = 'id1';

      repository.findAll.mockResolvedValue(mockFeatures);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 'id1');
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a FeatureResponseDto when feature exists', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const mockFeature = new Feature('Feature 1', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      mockFeature.id = 'id1';

      repository.findById.mockResolvedValue(mockFeature);

      const result = await service.findById('id1');

      expect(result).toHaveProperty('id', 'id1');
      expect(repository.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByProductId', () => {
    it('should return features for a product', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const mockFeatures = [
        new Feature('Feature 1', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'),
      ];
      mockFeatures[0].id = 'id1';

      repository.findByProductId.mockResolvedValue(mockFeatures);

      const result = await service.findByProductId('prod-1');

      expect(result).toHaveLength(1);
      expect(repository.findByProductId).toHaveBeenCalledWith('prod-1');
    });
  });

  describe('create', () => {
    const createDto: CreateFeatureDto = {
      name: 'New Feature',
      description: 'Description',
      category: { name: 'Category' },
      status: FeatureStatus.PLANNED,
      createdBy: { name: 'Owner' },
      technicalDescription: 'Tech',
      businessDescription: 'Biz',
      productId: 'prod-1',
    };

    it('should create and return a FeatureResponseDto', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const mockFeature = new Feature('New Feature', 'Description', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      mockFeature.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockFeature);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', 'new-id');
      expect(result).toHaveProperty('name', 'New Feature');
      expect(repository.findByName).toHaveBeenCalledWith('New Feature');
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when name already exists', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const existingFeature = new Feature('New Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      existingFeature.id = 'existing-id';

      repository.findByName.mockResolvedValue(existingFeature);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdateFeatureDto = {
      name: 'Updated Feature',
    };

    it('should update and return a FeatureResponseDto', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const existingFeature = new Feature('Old Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      existingFeature.id = 'id1';
      const updatedFeature = new Feature('Updated Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      updatedFeature.id = 'id1';

      repository.findById.mockResolvedValue(existingFeature);
      repository.update.mockResolvedValue(updatedFeature);

      const result = await service.update('id1', updateDto);

      expect(result).toHaveProperty('name', 'Updated Feature');
      expect(repository.findById).toHaveBeenCalledWith('id1');
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete feature successfully', async () => {
      repository.exists.mockResolvedValue(true);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('id1');

      expect(repository.exists).toHaveBeenCalledWith('id1');
      expect(repository.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      repository.exists.mockResolvedValue(false);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});

