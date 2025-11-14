/**
 * Base Phase Controller Unit Tests
 * 
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BasePhaseController } from './base-phase.controller';
import { BasePhaseService } from '../application/base-phase.service';
import { CreateBasePhaseDto } from '../application/dto/create-base-phase.dto';
import { UpdateBasePhaseDto } from '../application/dto/update-base-phase.dto';
import { BasePhaseResponseDto } from '../application/dto/base-phase-response.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { CacheService } from '../../common/cache/cache.service';

describe('BasePhaseController', () => {
  let controller: BasePhaseController;
  let service: jest.Mocked<BasePhaseService>;

  const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn(),
    reset: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
    store: {
      keys: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasePhaseController],
      providers: [
        {
          provide: BasePhaseService,
          useValue: mockService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<BasePhaseController>(BasePhaseController);
    service = module.get(BasePhaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of BasePhaseResponseDto', async () => {
      const mockResponse: BasePhaseResponseDto[] = [
        {
          id: 'id1',
          name: 'Phase 1',
          color: '#FF0000',
          category: 'Category 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'id2',
          name: 'Phase 2',
          color: '#00FF00',
          category: 'Category 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      service.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockResponse);
      expect(result).toHaveLength(2);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no phases exist', async () => {
      service.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a BasePhaseResponseDto', async () => {
      const mockResponse: BasePhaseResponseDto = {
        id: 'id1',
        name: 'Phase 1',
        color: '#FF0000',
        category: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(mockResponse);

      const result = await controller.findById('id1');

      expect(result).toEqual(mockResponse);
      expect(service.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when phase does not exist', async () => {
      service.findById.mockRejectedValue(
        new NotFoundException('Base Phase', 'non-existent'),
      );

      await expect(controller.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('create', () => {
    const createDto: CreateBasePhaseDto = {
      name: 'New Phase',
      color: '#0000FF',
      category: 'New Category',
    };

    it('should create and return a BasePhaseResponseDto', async () => {
      const mockResponse: BasePhaseResponseDto = {
        id: 'new-id',
        name: 'New Phase',
        color: '#0000FF',
        category: 'New Category',
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
        new ConflictException(
          'Base phase with name "New Phase" already exists',
          'DUPLICATE_PHASE_NAME',
        ),
      );

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException when color already exists', async () => {
      service.create.mockRejectedValue(
        new ConflictException(
          'Base phase with color "#0000FF" already exists',
          'DUPLICATE_PHASE_COLOR',
        ),
      );

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    const updateDto: UpdateBasePhaseDto = {
      name: 'Updated Phase',
      color: '#00FF00',
    };

    it('should update and return a BasePhaseResponseDto', async () => {
      const mockResponse: BasePhaseResponseDto = {
        id: 'id1',
        name: 'Updated Phase',
        color: '#00FF00',
        category: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(mockResponse);

      const result = await controller.update('id1', updateDto);

      expect(result).toEqual(mockResponse);
      expect(service.update).toHaveBeenCalledWith('id1', updateDto);
    });

    it('should throw NotFoundException when phase does not exist', async () => {
      service.update.mockRejectedValue(
        new NotFoundException('Base Phase', 'non-existent'),
      );

      await expect(controller.update('non-existent', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith('non-existent', updateDto);
    });

    it('should throw ConflictException when name already exists', async () => {
      service.update.mockRejectedValue(
        new ConflictException(
          'Base phase with name "Updated Phase" already exists',
          'DUPLICATE_PHASE_NAME',
        ),
      );

      await expect(controller.update('id1', updateDto)).rejects.toThrow(ConflictException);
      expect(service.update).toHaveBeenCalledWith('id1', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete phase successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('id1');

      expect(service.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when phase does not exist', async () => {
      service.delete.mockRejectedValue(
        new NotFoundException('Base Phase', 'non-existent'),
      );

      await expect(controller.delete('non-existent')).rejects.toThrow(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith('non-existent');
    });
  });
});

