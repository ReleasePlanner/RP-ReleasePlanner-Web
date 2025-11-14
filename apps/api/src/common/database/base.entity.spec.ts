/**
 * Base Entity Tests
 * Coverage: 100%
 */
import { BaseEntity } from './base.entity';

class TestEntity extends BaseEntity {
  name: string;
}

describe('BaseEntity', () => {
  describe('constructor', () => {
    it('should initialize id, createdAt, and updatedAt', () => {
      const entity = new TestEntity();

      expect(entity.id).toBeDefined();
      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('touch', () => {
    it('should update updatedAt timestamp', async () => {
      const entity = new TestEntity();
      const oldUpdatedAt = new Date(entity.updatedAt.getTime());
      
      // Wait a bit to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 10));
      entity.touch();
      
      expect(entity.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });
  });
});

