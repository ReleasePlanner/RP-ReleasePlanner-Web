/**
 * Plan Controller Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { PlanController } from './plan.controller';
import { PlanService } from '../application/plan.service';
import { CreatePlanDto } from '../application/dto/create-plan.dto';
import { UpdatePlanDto } from '../application/dto/update-plan.dto';
import { PlanResponseDto } from '../application/dto/plan-response.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('PlanController', () => {
  let controller: PlanController;
  let service: jest.Mocked<PlanService>;

  const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanController],
      providers: [
        {
          provide: PlanService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PlanController>(PlanController);
    service = module.get(PlanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of PlanResponseDto', async () => {
      const mockResponse: PlanResponseDto[] = [
        {
          id: 'id1',
          name: 'Plan 1',
          owner: 'Owner 1',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'planned' as any,
          phases: [],
          milestones: [],
          references: [],
          cellData: [],
          tasks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockResponse);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a PlanResponseDto', async () => {
      const mockResponse: PlanResponseDto = {
        id: 'id1',
        name: 'Plan 1',
        owner: 'Owner 1',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'planned' as any,
        phases: [],
        milestones: [],
        references: [],
        cellData: [],
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(mockResponse);

      const result = await controller.findById('id1');

      expect(result).toEqual(mockResponse);
      expect(service.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      service.findById.mockRejectedValue(new NotFoundException('Plan', 'non-existent'));

      await expect(controller.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreatePlanDto = {
      name: 'New Plan',
      owner: 'Owner',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    };

    it('should create and return a PlanResponseDto', async () => {
      const mockResponse: PlanResponseDto = {
        id: 'new-id',
        name: 'New Plan',
        owner: 'Owner',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'planned' as any,
        phases: [],
        milestones: [],
        references: [],
        cellData: [],
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.create.mockResolvedValue(mockResponse);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResponse);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException when name already exists', async () => {
      service.create.mockRejectedValue(
        new ConflictException('Plan with name "New Plan" already exists', 'DUPLICATE_PLAN_NAME'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateDto: UpdatePlanDto = {
      name: 'Updated Plan',
    };

    it('should update and return a PlanResponseDto', async () => {
      const mockResponse: PlanResponseDto = {
        id: 'id1',
        name: 'Updated Plan',
        owner: 'Owner',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'planned' as any,
        phases: [],
        milestones: [],
        references: [],
        cellData: [],
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(mockResponse);

      const result = await controller.update('id1', updateDto);

      expect(result).toEqual(mockResponse);
      expect(service.update).toHaveBeenCalledWith('id1', updateDto);
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      service.update.mockRejectedValue(new NotFoundException('Plan', 'non-existent'));

      await expect(controller.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete plan successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('id1');

      expect(service.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      service.delete.mockRejectedValue(new NotFoundException('Plan', 'non-existent'));

      await expect(controller.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});

