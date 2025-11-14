/**
 * Feature Response DTO Tests
 * Coverage: 100%
 */
import { Feature, FeatureStatus } from '../../domain/feature.entity';
import { FeatureCategory } from '../../domain/feature-category.entity';
import { ProductOwner } from '../../domain/product-owner.entity';
import {
  FeatureResponseDto,
  FeatureCategoryResponseDto,
  ProductOwnerResponseDto,
} from './feature-response.dto';

describe('FeatureResponseDto', () => {
  describe('FeatureCategoryResponseDto', () => {
    it('should create DTO from entity', () => {
      const category = new FeatureCategory('Category 1');
      category.id = 'category-id';

      const dto = new FeatureCategoryResponseDto(category);

      expect(dto.id).toBe('category-id');
      expect(dto.name).toBe('Category 1');
    });
  });

  describe('ProductOwnerResponseDto', () => {
    it('should create DTO from entity', () => {
      const owner = new ProductOwner('Owner 1');
      owner.id = 'owner-id';

      const dto = new ProductOwnerResponseDto(owner);

      expect(dto.id).toBe('owner-id');
      expect(dto.name).toBe('Owner 1');
    });
  });

  describe('FeatureResponseDto', () => {
    it('should create DTO from complete feature entity', () => {
      const category = new FeatureCategory('Category 1');
      category.id = 'category-id';

      const owner = new ProductOwner('Owner 1');
      owner.id = 'owner-id';

      const feature = new Feature(
        'Feature 1',
        'Description',
        category,
        FeatureStatus.PLANNED,
        owner,
        'Technical Description',
        'Business Description',
        'product-id',
      );
      feature.id = 'feature-id';
      feature.createdAt = new Date();
      feature.updatedAt = new Date();

      const dto = new FeatureResponseDto(feature);

      expect(dto.id).toBe('feature-id');
      expect(dto.name).toBe('Feature 1');
      expect(dto.description).toBe('Description');
      expect(dto.category.id).toBe('category-id');
      expect(dto.category.name).toBe('Category 1');
      expect(dto.status).toBe(FeatureStatus.PLANNED);
      expect(dto.createdBy.id).toBe('owner-id');
      expect(dto.createdBy.name).toBe('Owner 1');
      expect(dto.technicalDescription).toBe('Technical Description');
      expect(dto.businessDescription).toBe('Business Description');
      expect(dto.productId).toBe('product-id');
      expect(dto.createdAt).toBe(feature.createdAt);
      expect(dto.updatedAt).toBe(feature.updatedAt);
    });
  });
});

