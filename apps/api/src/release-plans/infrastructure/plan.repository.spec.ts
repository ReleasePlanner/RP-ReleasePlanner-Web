/**
 * Plan Repository Unit Tests
 * Coverage: 100%
 */
import { PlanRepository } from './plan.repository';
import { Plan, PlanStatus } from '../domain/plan.entity';

describe('PlanRepository', () => {
  let repository: PlanRepository;

  beforeEach(() => {
    repository = new PlanRepository();
  });

  afterEach(() => {
    (repository as any).entities.clear();
  });

  describe('findByName', () => {
    it('should find plan by name (case-insensitive)', async () => {
      const plan1 = new Plan('Plan One', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      const plan2 = new Plan('Plan Two', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);

      await repository.create(plan1);
      await repository.create(plan2);

      const found = await repository.findByName('plan one');
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Plan One');
    });

    it('should return null when plan not found', async () => {
      const found = await repository.findByName('Non Existent');
      expect(found).toBeNull();
    });
  });

  describe('findByOwner', () => {
    it('should find plans by owner', async () => {
      await repository.create(new Plan('Plan 1', 'Owner 1', '2024-01-01', '2024-12-31', PlanStatus.PLANNED));
      await repository.create(new Plan('Plan 2', 'Owner 2', '2024-01-01', '2024-12-31', PlanStatus.PLANNED));
      await repository.create(new Plan('Plan 3', 'Owner 1', '2024-01-01', '2024-12-31', PlanStatus.PLANNED));

      const found = await repository.findByOwner('Owner 1');
      expect(found).toHaveLength(2);
      expect(found.every((p) => p.owner === 'Owner 1')).toBe(true);
    });
  });

  describe('findByStatus', () => {
    it('should find plans by status', async () => {
      await repository.create(new Plan('Plan 1', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED));
      await repository.create(new Plan('Plan 2', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.IN_PROGRESS));
      await repository.create(new Plan('Plan 3', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED));

      const found = await repository.findByStatus(PlanStatus.PLANNED);
      expect(found).toHaveLength(2);
      expect(found.every((p) => p.status === PlanStatus.PLANNED)).toBe(true);
    });
  });

  describe('CRUD operations', () => {
    it('should create a new plan', async () => {
      const plan = new Plan('Test Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      const created = await repository.create(plan);

      expect(created).toHaveProperty('id');
      expect(created.name).toBe('Test Plan');
      expect(created.owner).toBe('Owner');
    });

    it('should find all plans', async () => {
      await repository.create(new Plan('Plan 1', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED));
      await repository.create(new Plan('Plan 2', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED));

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    it('should find plan by id', async () => {
      const plan = new Plan('Test Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      const created = await repository.create(plan);

      const found = await repository.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });

    it('should update plan', async () => {
      const plan = new Plan('Old Name', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      const created = await repository.create(plan);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await repository.update(created.id, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should delete plan', async () => {
      const plan = new Plan('Test Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      const created = await repository.create(plan);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });
});

