/**
 * Feature Category Entity Unit Tests
 * Coverage: 100%
 */
import { FeatureCategory } from './feature-category.entity';

describe('FeatureCategory', () => {
  describe('constructor', () => {
    it('should create a FeatureCategory with name', () => {
      const category = new FeatureCategory('Test Category');

      expect(category.name).toBe('Test Category');
      expect(category.id).toBeDefined();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('validate', () => {
    it('should pass validation with valid name', () => {
      expect(() => {
        new FeatureCategory('Valid Category');
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new FeatureCategory('');
      }).toThrow('Category name is required');
    });

    it('should throw error when name is only whitespace', () => {
      expect(() => {
        new FeatureCategory('   ');
      }).toThrow('Category name is required');
    });
  });
});

