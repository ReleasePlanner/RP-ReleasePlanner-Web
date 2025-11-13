/**
 * IT Owner Entity Unit Tests
 * Coverage: 100%
 */
import { ITOwner } from './it-owner.entity';

describe('ITOwner', () => {
  describe('constructor', () => {
    it('should create an ITOwner with name', () => {
      const owner = new ITOwner('Test Owner');

      expect(owner.name).toBe('Test Owner');
      expect(owner.id).toBeDefined();
      expect(owner.createdAt).toBeInstanceOf(Date);
      expect(owner.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('validate', () => {
    it('should pass validation with valid name', () => {
      expect(() => {
        new ITOwner('Valid Owner');
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new ITOwner('');
      }).toThrow('IT Owner name is required');
    });

    it('should throw error when name is only whitespace', () => {
      expect(() => {
        new ITOwner('   ');
      }).toThrow('IT Owner name is required');
    });
  });
});

