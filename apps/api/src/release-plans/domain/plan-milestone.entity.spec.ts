/**
 * Plan Milestone Entity Unit Tests
 * Coverage: 100%
 */
import { PlanMilestone } from './plan-milestone.entity';

describe('PlanMilestone', () => {
  describe('constructor', () => {
    it('should create a PlanMilestone with all properties', () => {
      const milestone = new PlanMilestone('2024-01-01', 'Milestone 1', 'Description');

      expect(milestone.date).toBe('2024-01-01');
      expect(milestone.name).toBe('Milestone 1');
      expect(milestone.description).toBe('Description');
    });

    it('should create a PlanMilestone without description', () => {
      const milestone = new PlanMilestone('2024-01-01', 'Milestone 1');

      expect(milestone.description).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new PlanMilestone('2024-01-01', 'Valid Milestone');
      }).not.toThrow();
    });

    it('should throw error when date format is invalid', () => {
      expect(() => {
        new PlanMilestone('invalid-date', 'Milestone');
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new PlanMilestone('2024-01-01', '');
      }).toThrow('Milestone name is required');
    });
  });
});

