/**
 * Feature Repository Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureRepository } from './feature.repository';
import { Feature, FeatureStatus } from '../domain/feature.entity';
import { FeatureCategory } from '../../feature-categories/domain/feature-category.entity';
import { ProductOwner } from '../domain/product-owner.entity';
import { NotFoundException } from '../../common/exceptions/business-exception';

describe('FeatureRepository', () => {
  let repository: FeatureRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<Feature>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<Feature>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureRepository,
        {
          provide: getRepositoryToken(Feature),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<FeatureRepository>(FeatureRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(Feature));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByProductId', () => {
    it('should find features by product id', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const features = [
        new Feature('Feature 1', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'),
        new Feature('Feature 2', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(features);

      const result = await repository.findByProductId('prod-1');

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { productId: 'prod-1' },
        relations: ['category', 'createdBy'],
      });
      expect(result).toEqual(features);
    });
  });

  describe('findByStatus', () => {
    it('should find features by status', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const features = [
        new Feature('Feature 1', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'),
        new Feature('Feature 2', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(features);

      const result = await repository.findByStatus(FeatureStatus.PLANNED);

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { status: FeatureStatus.PLANNED },
        relations: ['category', 'createdBy'],
      });
      expect(result).toEqual(features);
    });
  });

  describe('CRUD operations', () => {
    it('should create a new feature', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const featureData = {
        name: 'Test Feature',
        description: 'Description',
        category,
        status: FeatureStatus.PLANNED,
        createdBy: owner,
        technicalDescription: 'Tech',
        businessDescription: 'Biz',
        productId: 'prod-1',
      } as Feature;
      const savedFeature = new Feature('Test Feature', 'Description', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      savedFeature.id = 'test-id';

      mockTypeOrmRepository.create.mockReturnValue(featureData as Feature);
      mockTypeOrmRepository.save.mockResolvedValue(savedFeature);

      const created = await repository.create(featureData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(featureData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(created).toEqual(savedFeature);
    });

    it('should find all features', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const features = [
        new Feature('Feature 1', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'),
        new Feature('Feature 2', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1'),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(features);

      const result = await repository.findAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(result).toEqual(features);
    });

    it('should find feature by id', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature = new Feature('Test Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      feature.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(feature);

      const result = await repository.findById('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result).toEqual(feature);
    });

    it('should update feature', async () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const existingFeature = new Feature('Old Name', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      existingFeature.id = 'test-id';
      const updatedFeature = new Feature('New Name', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      updatedFeature.id = 'test-id';

      mockTypeOrmRepository.findOne.mockResolvedValue(existingFeature);
      mockTypeOrmRepository.save.mockResolvedValue(updatedFeature);

      const result = await repository.update('test-id', { name: 'New Name' } as any);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('New Name');
    });

    it('should throw error when updating non-existent feature', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('non-existent', { name: 'New Name' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should delete feature', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('test-id');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error when deleting non-existent feature', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
