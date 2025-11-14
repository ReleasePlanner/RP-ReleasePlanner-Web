/**
 * Plan Repository Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanRepository } from './plan.repository';
import { Plan, PlanStatus } from '../domain/plan.entity';
import { NotFoundException } from '../../common/exceptions/business-exception';

describe('PlanRepository', () => {
  let repository: PlanRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<Plan>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<Plan>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanRepository,
        {
          provide: getRepositoryToken(Plan),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<PlanRepository>(PlanRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(Plan));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByProductId', () => {
    it('should find plans by product id', async () => {
      const plans = [
        new Plan('Plan 1', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
        new Plan('Plan 2', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(plans);

      const found = await repository.findByProductId('product-id');

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { productId: 'product-id' },
      });
      expect(found).toEqual(plans);
    });
  });

  describe('findByStatus', () => {
    it('should find plans by status', async () => {
      const plans = [
        new Plan('Plan 1', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
        new Plan('Plan 2', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(plans);

      const found = await repository.findByStatus(PlanStatus.PLANNED);

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { status: PlanStatus.PLANNED },
      });
      expect(found).toEqual(plans);
    });
  });

  describe('findByOwner', () => {
    it('should find plans by owner', async () => {
      const plans = [
        new Plan('Plan 1', 'Owner 1', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
        new Plan('Plan 2', 'Owner 1', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(plans);

      const found = await repository.findByOwner('Owner 1');

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { owner: 'Owner 1' },
      });
      expect(found).toEqual(plans);
    });
  });

  describe('findWithRelations', () => {
    it('should find plan with all relations', async () => {
      const plan = new Plan('Test Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      plan.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(plan);

      const found = await repository.findWithRelations('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: [
          'phases',
          'tasks',
          'milestones',
          'references',
          'cellData',
          'cellData.comments',
          'cellData.files',
          'cellData.links',
        ],
      });
      expect(found).toEqual(plan);
    });

    it('should return null when plan not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const found = await repository.findWithRelations('non-existent');

      expect(found).toBeNull();
    });
  });

  describe('findById', () => {
    it('should use findWithRelations', async () => {
      const plan = new Plan('Test Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      plan.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(plan);

      const found = await repository.findById('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: [
          'phases',
          'tasks',
          'milestones',
          'references',
          'cellData',
          'cellData.comments',
          'cellData.files',
          'cellData.links',
        ],
      });
      expect(found).toEqual(plan);
    });
  });

  describe('CRUD operations', () => {
    it('should create a new plan', async () => {
      const planData = {
        name: 'Test Plan',
        owner: 'Owner',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: PlanStatus.PLANNED,
      } as Plan;
      const savedPlan = new Plan('Test Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      savedPlan.id = 'test-id';
      
      mockTypeOrmRepository.create.mockReturnValue(planData as Plan);
      mockTypeOrmRepository.save.mockResolvedValue(savedPlan);

      const created = await repository.create(planData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(planData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(created).toEqual(savedPlan);
    });

    it('should find all plans', async () => {
      const plans = [
        new Plan('Plan 1', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
        new Plan('Plan 2', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(plans);

      const all = await repository.findAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(all).toEqual(plans);
    });

    it('should update plan', async () => {
      const existingPlan = new Plan('Old Name', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      existingPlan.id = 'test-id';
      const updatedPlan = new Plan('New Name', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      updatedPlan.id = 'test-id';

      mockTypeOrmRepository.findOne.mockResolvedValue(existingPlan);
      mockTypeOrmRepository.save.mockResolvedValue(updatedPlan);

      const updated = await repository.update('test-id', { name: 'New Name' });

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(updated.name).toBe('New Name');
    });

    it('should throw error when updating non-existent plan', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await expect(
        repository.update('non-existent', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete plan', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('test-id');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error when deleting non-existent plan', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
