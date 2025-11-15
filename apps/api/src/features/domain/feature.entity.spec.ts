/**
 * Feature Entity Unit Tests
 * Coverage: 100%
 */
import { Feature, FeatureStatus } from './feature.entity';
import { FeatureCategory } from '../../feature-categories/domain/feature-category.entity';
import { ProductOwner } from './product-owner.entity';

describe('Feature', () => {
  describe('constructor', () => {
    it('should create a Feature with all properties', () => {
      const category = new FeatureCategory('Category');
      category.id = 'cat-id';
      const owner = new ProductOwner('Owner');
      owner.id = 'owner-id';
      const feature = new Feature(
        'Feature Name',
        'Description',
        category,
        FeatureStatus.PLANNED,
        owner,
        'Technical Description',
        'Business Description',
        'prod-1',
      );

      expect(feature.name).toBe('Feature Name');
      expect(feature.description).toBe('Description');
      expect(feature.category).toBe(category);
      expect(feature.categoryId).toBe('cat-id');
      expect(feature.status).toBe(FeatureStatus.PLANNED);
      expect(feature.createdBy).toBe(owner);
      expect(feature.createdById).toBe('owner-id');
      expect(feature.technicalDescription).toBe('Technical Description');
      expect(feature.businessDescription).toBe('Business Description');
      expect(feature.productId).toBe('prod-1');
    });

    it('should create a Feature without optional properties', () => {
      const category = new FeatureCategory('Category');
      category.id = 'cat-id';
      const owner = new ProductOwner('Owner');
      owner.id = 'owner-id';
      const feature = new Feature(
        'Feature Name',
        'Description',
        category,
        FeatureStatus.PLANNED,
        owner,
        undefined,
        undefined,
        'prod-1',
      );

      expect(feature.name).toBe('Feature Name');
      expect(feature.description).toBe('Description');
      expect(feature.technicalDescription).toBeUndefined();
      expect(feature.businessDescription).toBeUndefined();
    });

    it('should not validate when name is undefined', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature = new Feature(
        undefined as any,
        'Description',
        category,
        FeatureStatus.PLANNED,
        owner,
        undefined,
        undefined,
        'prod-1',
      );

      expect(feature.name).toBeUndefined();
      // Should not throw because validation is not called
    });

    it('should not validate when description is undefined', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature = new Feature(
        'Feature Name',
        undefined as any,
        category,
        FeatureStatus.PLANNED,
        owner,
        undefined,
        undefined,
        'prod-1',
      );

      expect(feature.description).toBeUndefined();
      // Should not throw because validation is not called
    });

    it('should not validate when productId is undefined', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      const feature = new Feature(
        'Feature Name',
        'Description',
        category,
        FeatureStatus.PLANNED,
        owner,
        undefined,
        undefined,
        undefined as any,
      );

      expect(feature.productId).toBeUndefined();
      // Should not throw because validation is not called
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      }).toThrow('Feature name is required');
    });

    it('should throw error when name is whitespace only', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('   ', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      }).toThrow('Feature name is required');
    });

    it('should throw error when description is empty', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('Feature', '', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      }).toThrow('Feature description is required');
    });

    it('should throw error when description is whitespace only', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('Feature', '   ', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      }).toThrow('Feature description is required');
    });

    it('should throw error when productId is empty', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', '');
      }).toThrow('Product ID is required');
    });

    it('should throw error when productId is whitespace only', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', '   ');
      }).toThrow('Product ID is required');
    });

    it('should throw error when status is invalid', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('Feature', 'Desc', category, 'invalid' as FeatureStatus, owner, 'Tech', 'Biz', 'prod-1');
      }).toThrow('Invalid feature status: invalid');
    });

    it('should accept all valid statuses', () => {
      const category = new FeatureCategory('Category');
      const owner = new ProductOwner('Owner');
      expect(() => {
        new Feature('Feature', 'Desc', category, FeatureStatus.PLANNED, owner, 'Tech', 'Biz', 'prod-1');
      }).not.toThrow();
      expect(() => {
        new Feature('Feature', 'Desc', category, FeatureStatus.IN_PROGRESS, owner, 'Tech', 'Biz', 'prod-1');
      }).not.toThrow();
      expect(() => {
        new Feature('Feature', 'Desc', category, FeatureStatus.COMPLETED, owner, 'Tech', 'Biz', 'prod-1');
      }).not.toThrow();
      expect(() => {
        new Feature('Feature', 'Desc', category, FeatureStatus.ON_HOLD, owner, 'Tech', 'Biz', 'prod-1');
      }).not.toThrow();
    });
  });
});

