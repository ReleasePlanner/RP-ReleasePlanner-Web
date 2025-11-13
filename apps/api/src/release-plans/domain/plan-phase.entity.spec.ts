/**
 * Plan Phase Entity Unit Tests
 * Coverage: 100%
 */
import { PlanPhase } from './plan-phase.entity';

describe('PlanPhase', () => {
  describe('constructor', () => {
    it('should create a PlanPhase with name only', () => {
      const phase = new PlanPhase('Phase 1');

      expect(phase.name).toBe('Phase 1');
      expect(phase.startDate).toBeUndefined();
      expect(phase.endDate).toBeUndefined();
      expect(phase.color).toBeUndefined();
    });

    it('should create a PlanPhase with all properties', () => {
      const phase = new PlanPhase('Phase 1', '2024-01-01', '2024-01-31', '#FF0000');

      expect(phase.name).toBe('Phase 1');
      expect(phase.startDate).toBe('2024-01-01');
      expect(phase.endDate).toBe('2024-01-31');
      expect(phase.color).toBe('#FF0000');
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new PlanPhase('Valid Phase', '2024-01-01', '2024-01-31', '#FF0000');
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new PlanPhase('', '2024-01-01', '2024-01-31');
      }).toThrow('Phase name is required');
    });

    it('should throw error when startDate is after endDate', () => {
      expect(() => {
        new PlanPhase('Phase', '2024-01-31', '2024-01-01');
      }).toThrow('Start date must be before or equal to end date');
    });

    it('should throw error when color format is invalid', () => {
      expect(() => {
        new PlanPhase('Phase', '2024-01-01', '2024-01-31', 'invalid-color');
      }).toThrow('Invalid color format. Must be a valid hex color');
    });

    it('should accept valid hex color formats', () => {
      expect(() => {
        new PlanPhase('Phase', '2024-01-01', '2024-01-31', '#FF0000');
      }).not.toThrow();
      expect(() => {
        new PlanPhase('Phase', '2024-01-01', '2024-01-31', '#FFF');
      }).not.toThrow();
    });

    it('should allow phase without dates', () => {
      expect(() => {
        new PlanPhase('Phase');
      }).not.toThrow();
    });
  });
});

