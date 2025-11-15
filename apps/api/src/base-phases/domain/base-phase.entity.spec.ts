/**
 * Base Phase Entity Unit Tests
 * 
 * Coverage: 100%
 */
import { BasePhase } from './base-phase.entity';

describe('BasePhase', () => {
  describe('constructor', () => {
    it('should create a BasePhase with all properties', () => {
      const phase = new BasePhase('Test Phase', '#FF0000');

      expect(phase.name).toBe('Test Phase');
      expect(phase.color).toBe('#FF0000');
      expect(phase.id).toBeDefined();
      expect(phase.createdAt).toBeInstanceOf(Date);
      expect(phase.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      const phase = new BasePhase('Valid Phase', '#FF0000');
      expect(() => {
        phase.validate();
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      const phase = new BasePhase('', '#FF0000');
      expect(() => {
        phase.validate();
      }).toThrow('Phase name is required');
    });

    it('should throw error when name is only whitespace', () => {
      const phase = new BasePhase('   ', '#FF0000');
      expect(() => {
        phase.validate();
      }).toThrow('Phase name is required');
    });

    it('should throw error when color is empty', () => {
      const phase = new BasePhase('Valid Phase', '');
      expect(() => {
        phase.validate();
      }).toThrow('Phase color is required');
    });

    it('should throw error when color is only whitespace', () => {
      const phase = new BasePhase('Valid Phase', '   ');
      expect(() => {
        phase.validate();
      }).toThrow('Phase color is required');
    });

    it('should throw error when color format is invalid', () => {
      const phase = new BasePhase('Valid Phase', 'invalid-color');
      expect(() => {
        phase.validate();
      }).toThrow('Invalid color format. Must be a valid hex color');
    });

    it('should accept valid hex color formats', () => {
      const phase1 = new BasePhase('Valid Phase', '#FF0000');
      const phase2 = new BasePhase('Valid Phase', '#FFF');
      const phase3 = new BasePhase('Valid Phase', '#ff00ff');

      expect(() => phase1.validate()).not.toThrow();
      expect(() => phase2.validate()).not.toThrow();
      expect(() => phase3.validate()).not.toThrow();
    });
  });

  describe('inherited properties', () => {
    it('should have id property from BaseEntity', () => {
      const phase = new BasePhase('Test', '#FF0000');
      expect(phase).toHaveProperty('id');
    });

    it('should have createdAt property from BaseEntity', () => {
      const phase = new BasePhase('Test', '#FF0000');
      expect(phase).toHaveProperty('createdAt');
      expect(phase.createdAt).toBeInstanceOf(Date);
    });

    it('should have updatedAt property from BaseEntity', () => {
      const phase = new BasePhase('Test', '#FF0000');
      expect(phase).toHaveProperty('updatedAt');
      expect(phase.updatedAt).toBeInstanceOf(Date);
    });
  });
});

