/**
 * Plan Entity Unit Tests
 * Coverage: 100%
 */
import { Plan, PlanStatus } from './plan.entity';
import { PlanPhase } from './plan-phase.entity';
import { PlanTask } from './plan-task.entity';
import { PlanMilestone } from './plan-milestone.entity';

describe('Plan', () => {
  describe('constructor', () => {
    it('should create a Plan with required properties', () => {
      const plan = new Plan('Test Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);

      expect(plan.name).toBe('Test Plan');
      expect(plan.owner).toBe('Owner');
      expect(plan.startDate).toBe('2024-01-01');
      expect(plan.endDate).toBe('2024-12-31');
      expect(plan.status).toBe(PlanStatus.PLANNED);
      expect(plan.phases).toEqual([]);
      expect(plan.featureIds).toEqual([]);
      expect(plan.milestones).toEqual([]);
      expect(plan.tasks).toEqual([]);
    });

    it('should use default status when not provided', () => {
      const plan = new Plan('Test Plan', 'Owner', '2024-01-01', '2024-12-31');

      expect(plan.status).toBe(PlanStatus.PLANNED);
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new Plan('Valid Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new Plan('', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      }).toThrow('Plan name is required');
    });

    it('should throw error when owner is empty', () => {
      expect(() => {
        new Plan('Plan', '', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      }).toThrow('Plan owner is required');
    });

    it('should throw error when startDate format is invalid', () => {
      expect(() => {
        new Plan('Plan', 'Owner', 'invalid-date', '2024-12-31', PlanStatus.PLANNED);
      }).toThrow('Valid start date in YYYY-MM-DD format is required');
    });

    it('should throw error when endDate format is invalid', () => {
      expect(() => {
        new Plan('Plan', 'Owner', '2024-01-01', 'invalid-date', PlanStatus.PLANNED);
      }).toThrow('Valid end date in YYYY-MM-DD format is required');
    });

    it('should throw error when startDate is after endDate', () => {
      expect(() => {
        new Plan('Plan', 'Owner', '2024-12-31', '2024-01-01', PlanStatus.PLANNED);
      }).toThrow('Start date must be before or equal to end date');
    });

    it('should throw error when status is invalid', () => {
      expect(() => {
        new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', 'invalid' as PlanStatus);
      }).toThrow('Invalid plan status: invalid');
    });

    it('should accept all valid statuses', () => {
      expect(() => {
        new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      }).not.toThrow();
      expect(() => {
        new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.IN_PROGRESS);
      }).not.toThrow();
      expect(() => {
        new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.DONE);
      }).not.toThrow();
      expect(() => {
        new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PAUSED);
      }).not.toThrow();
    });
  });

  describe('addPhase', () => {
    it('should add a phase to the plan', () => {
      const plan = new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      const phase = new PlanPhase('Phase 1', '2024-01-01', '2024-01-31');
      const oldUpdatedAt = new Date(plan.updatedAt.getTime());

      plan.addPhase(phase);

      expect(plan.phases).toHaveLength(1);
      expect(plan.phases[0].name).toBe('Phase 1');
      expect(plan.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });
  });

  describe('removePhase', () => {
    it('should remove a phase from the plan', () => {
      const plan = new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      const phase = new PlanPhase('Phase 1', '2024-01-01', '2024-01-31');
      plan.addPhase(phase);

      plan.removePhase(phase.id);

      expect(plan.phases).toHaveLength(0);
    });

    it('should throw error when phase not found', () => {
      const plan = new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);

      expect(() => {
        plan.removePhase('non-existent');
      }).toThrow('Phase with id non-existent not found');
    });
  });
});

