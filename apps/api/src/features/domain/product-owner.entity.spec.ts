/**
 * Product Owner Entity Unit Tests
 * Coverage: 100%
 */
import { ProductOwner } from './product-owner.entity';

describe('ProductOwner', () => {
  describe('constructor', () => {
    it('should create a ProductOwner with name', () => {
      const owner = new ProductOwner('Test Owner');

      expect(owner.name).toBe('Test Owner');
      expect(owner.id).toBeDefined();
      expect(owner.createdAt).toBeInstanceOf(Date);
      expect(owner.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('validate', () => {
    it('should pass validation with valid name', () => {
      expect(() => {
        new ProductOwner('Valid Owner');
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new ProductOwner('');
      }).toThrow('Product owner name is required');
    });

    it('should throw error when name is only whitespace', () => {
      expect(() => {
        new ProductOwner('   ');
      }).toThrow('Product owner name is required');
    });
  });
});

