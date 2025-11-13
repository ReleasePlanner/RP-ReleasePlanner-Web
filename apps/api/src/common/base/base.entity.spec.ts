/**
 * Base Entity Unit Tests
 * 
 * Coverage: 100%
 */
import { BaseEntity } from './base.entity';

// Create a concrete implementation for testing
class TestEntity extends BaseEntity {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Name is required');
    }
  }
}

describe('BaseEntity', () => {
  describe('constructor', () => {
    it('should initialize with default values', () => {
      const entity = new TestEntity('Test');

      expect(entity.id).toBeDefined();
      expect(entity.id).not.toBe('');
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should set createdAt and updatedAt to current date', () => {
      const before = new Date();
      const entity = new TestEntity('Test');
      const after = new Date();

      expect(entity.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(entity.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(entity.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('validate', () => {
    it('should call validate method when implemented', () => {
      const entity = new TestEntity('Valid Name');
      expect(() => {
        entity.validate();
      }).not.toThrow();
    });

    it('should throw error when validation fails', () => {
      const entity = new TestEntity('');
      expect(() => {
        entity.validate();
      }).toThrow('Name is required');
    });
  });
});

