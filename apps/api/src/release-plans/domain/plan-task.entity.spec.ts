/**
 * Plan Task Entity Unit Tests
 * Coverage: 100%
 */
import { PlanTask } from './plan-task.entity';

describe('PlanTask', () => {
  describe('constructor', () => {
    it('should create a PlanTask with all properties', () => {
      const task = new PlanTask('Task 1', '2024-01-01', '2024-01-31', '#FF0000');

      expect(task.title).toBe('Task 1');
      expect(task.startDate).toBe('2024-01-01');
      expect(task.endDate).toBe('2024-01-31');
      expect(task.color).toBe('#FF0000');
    });

    it('should create a PlanTask without color', () => {
      const task = new PlanTask('Task 1', '2024-01-01', '2024-01-31');

      expect(task.color).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new PlanTask('Valid Task', '2024-01-01', '2024-01-31', '#FF0000');
      }).not.toThrow();
    });

    it('should throw error when title is empty', () => {
      expect(() => {
        new PlanTask('', '2024-01-01', '2024-01-31');
      }).toThrow('Task title is required');
    });

    it('should throw error when startDate format is invalid', () => {
      expect(() => {
        new PlanTask('Task', 'invalid-date', '2024-01-31');
      }).toThrow('Valid start date in YYYY-MM-DD format is required');
    });

    it('should throw error when endDate format is invalid', () => {
      expect(() => {
        new PlanTask('Task', '2024-01-01', 'invalid-date');
      }).toThrow('Valid end date in YYYY-MM-DD format is required');
    });

    it('should throw error when startDate is after endDate', () => {
      expect(() => {
        new PlanTask('Task', '2024-01-31', '2024-01-01');
      }).toThrow('Start date must be before or equal to end date');
    });

    it('should throw error when color format is invalid', () => {
      expect(() => {
        new PlanTask('Task', '2024-01-01', '2024-01-31', 'invalid-color');
      }).toThrow('Invalid color format. Must be a valid hex color');
    });

    it('should accept valid hex color formats', () => {
      expect(() => {
        new PlanTask('Task', '2024-01-01', '2024-01-31', '#FF0000');
      }).not.toThrow();
      expect(() => {
        new PlanTask('Task', '2024-01-01', '2024-01-31', '#FFF');
      }).not.toThrow();
      expect(() => {
        new PlanTask('Task', '2024-01-01', '2024-01-31', '#ff00ff');
      }).not.toThrow();
    });

    it('should allow task without color', () => {
      expect(() => {
        new PlanTask('Task', '2024-01-01', '2024-01-31');
      }).not.toThrow();
    });

    it('should accept equal start and end dates', () => {
      expect(() => {
        new PlanTask('Task', '2024-01-01', '2024-01-01');
      }).not.toThrow();
    });
  });
});

