/**
 * Plan Service Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from './plan.service';
import { IPlanRepository } from '../infrastructure/plan.repository';
import { Plan, PlanStatus } from '../domain/plan.entity';
import { PlanPhase } from '../domain/plan-phase.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('PlanService', () => {
  let service: PlanService;
  let repository: jest.Mocked<IPlanRepository>;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        {
          provide: 'IPlanRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);
    repository = module.get('IPlanRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of PlanResponseDto', async () => {
      const mockPlans = [
        new Plan('Plan 1', 'Owner 1', '2024-01-01', '2024-12-31', PlanStatus.PLANNED),
      ];
      mockPlans[0].id = 'id1';

      repository.findAll.mockResolvedValue(mockPlans);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 'id1');
      expect(result[0]).toHaveProperty('name', 'Plan 1');
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a PlanResponseDto when plan exists', async () => {
      const mockPlan = new Plan('Plan 1', 'Owner 1', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      mockPlan.id = 'id1';

      repository.findById.mockResolvedValue(mockPlan);

      const result = await service.findById('id1');

      expect(result).toHaveProperty('id', 'id1');
      expect(result).toHaveProperty('name', 'Plan 1');
      expect(repository.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('create', () => {
    const createDto: CreatePlanDto = {
      name: 'New Plan',
      owner: 'Owner',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: PlanStatus.PLANNED,
    };

    it('should create and return a PlanResponseDto', async () => {
      const mockPlan = new Plan('New Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      mockPlan.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockPlan);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', 'new-id');
      expect(result).toHaveProperty('name', 'New Plan');
      expect(repository.findByName).toHaveBeenCalledWith('New Plan');
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when name already exists', async () => {
      const existingPlan = new Plan('New Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      existingPlan.id = 'existing-id';

      repository.findByName.mockResolvedValue(existingPlan);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should create plan with optional fields', async () => {
      const createDtoWithOptions: CreatePlanDto = {
        name: 'Plan',
        owner: 'Owner',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        description: 'Description',
        productId: 'prod-1',
        itOwner: 'it-owner-1',
        featureIds: ['feat-1'],
        calendarIds: ['cal-1'],
        phases: [{ name: 'Phase 1', startDate: '2024-01-01', endDate: '2024-01-31' }],
      };
      const mockPlan = new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      mockPlan.id = 'new-id';
      mockPlan.description = 'Description';
      mockPlan.productId = 'prod-1';
      mockPlan.itOwner = 'it-owner-1';
      mockPlan.featureIds = ['feat-1'];
      mockPlan.calendarIds = ['cal-1'];

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockPlan);

      const result = await service.create(createDtoWithOptions);

      expect(result).toHaveProperty('description', 'Description');
      expect(result).toHaveProperty('productId', 'prod-1');
    });

    it('should use default status when not provided', async () => {
      const createDtoNoStatus: CreatePlanDto = {
        name: 'Plan',
        owner: 'Owner',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };
      const mockPlan = new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      mockPlan.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockPlan);

      await service.create(createDtoNoStatus);

      expect(repository.create).toHaveBeenCalled();
    });

    it('should create plan with phases when provided', async () => {
      const createDtoWithPhases: CreatePlanDto = {
        name: 'Plan',
        owner: 'Owner',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        phases: [
          { name: 'Phase 1', startDate: '2024-01-01', endDate: '2024-01-31', color: '#FF0000' },
          { name: 'Phase 2', startDate: '2024-02-01', endDate: '2024-02-28', color: '#00FF00' },
        ],
      };

      const mockPlan = new Plan('Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      mockPlan.id = 'new-id';
      const phase1 = new PlanPhase('Phase 1', '2024-01-01', '2024-01-31', '#FF0000');
      const phase2 = new PlanPhase('Phase 2', '2024-02-01', '2024-02-28', '#00FF00');
      mockPlan.phases = [phase1, phase2];

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockPlan);

      const result = await service.create(createDtoWithPhases);

      expect(result).toHaveProperty('id', 'new-id');
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdatePlanDto = {
      name: 'Updated Plan',
    };

    it('should update and return a PlanResponseDto', async () => {
      const existingPlan = new Plan('Old Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      existingPlan.id = 'id1';
      const updatedPlan = new Plan('Updated Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      updatedPlan.id = 'id1';

      repository.findById.mockResolvedValue(existingPlan);
      repository.findByName.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedPlan);

      const result = await service.update('id1', updateDto);

      expect(result).toHaveProperty('name', 'Updated Plan');
      expect(repository.findById).toHaveBeenCalledWith('id1');
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new name already exists', async () => {
      const existingPlan = new Plan('Old Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      existingPlan.id = 'id1';
      const conflictingPlan = new Plan('Updated Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      conflictingPlan.id = 'other-id';

      repository.findById.mockResolvedValue(existingPlan);
      repository.findByName.mockResolvedValue(conflictingPlan);

      await expect(service.update('id1', updateDto)).rejects.toThrow(ConflictException);
    });

    it('should allow update when name is unchanged', async () => {
      const existingPlan = new Plan('Old Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      existingPlan.id = 'id1';
      const updatedPlan = new Plan('Old Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      updatedPlan.id = 'id1';

      const updateDtoSameName: UpdatePlanDto = {
        name: 'Old Plan',
      };

      repository.findById.mockResolvedValue(existingPlan);
      repository.update.mockResolvedValue(updatedPlan);

      const result = await service.update('id1', updateDtoSameName);

      expect(result).toHaveProperty('name', 'Old Plan');
      expect(repository.findByName).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should allow update without name', async () => {
      const existingPlan = new Plan('Old Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      existingPlan.id = 'id1';
      const updatedPlan = new Plan('Old Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      updatedPlan.id = 'id1';

      const updateDtoNoName: UpdatePlanDto = {
        description: 'New Description',
      };

      repository.findById.mockResolvedValue(existingPlan);
      repository.update.mockResolvedValue(updatedPlan);

      const result = await service.update('id1', updateDtoNoName);

      expect(result).toHaveProperty('name', 'Old Plan');
      expect(repository.findByName).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should allow update when name exists but is the same plan', async () => {
      const existingPlan = new Plan('Old Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      existingPlan.id = 'id1';
      const updatedPlan = new Plan('Updated Plan', 'Owner', '2024-01-01', '2024-12-31', PlanStatus.PLANNED);
      updatedPlan.id = 'id1';

      const updateDtoNewName: UpdatePlanDto = {
        name: 'Updated Plan',
      };

      repository.findById.mockResolvedValue(existingPlan);
      repository.findByName.mockResolvedValue(existingPlan); // Same plan found
      repository.update.mockResolvedValue(updatedPlan);

      const result = await service.update('id1', updateDtoNewName);

      expect(result).toHaveProperty('name', 'Updated Plan');
      expect(repository.findByName).toHaveBeenCalledWith('Updated Plan');
      expect(repository.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete plan successfully', async () => {
      repository.exists.mockResolvedValue(true);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('id1');

      expect(repository.exists).toHaveBeenCalledWith('id1');
      expect(repository.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      repository.exists.mockResolvedValue(false);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});

