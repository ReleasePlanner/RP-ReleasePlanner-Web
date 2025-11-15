/**
 * Base Phase Service Unit Tests
 * 
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { BasePhaseService } from './base-phase.service';
import { IBasePhaseRepository } from '../infrastructure/base-phase.repository';
import { BasePhase } from '../domain/base-phase.entity';
import { CreateBasePhaseDto } from './dto/create-base-phase.dto';
import { UpdateBasePhaseDto } from './dto/update-base-phase.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('BasePhaseService', () => {
  let service: BasePhaseService;
  let repository: jest.Mocked<IBasePhaseRepository>;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByColor: jest.fn(),
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
        BasePhaseService,
        {
          provide: 'IBasePhaseRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BasePhaseService>(BasePhaseService);
    repository = module.get('IBasePhaseRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of BasePhaseResponseDto', async () => {
      const mockPhases = [
        new BasePhase('Phase 1', '#FF0000'),
        new BasePhase('Phase 2', '#00FF00'),
      ];
      mockPhases[0].id = 'id1';
      mockPhases[1].id = 'id2';

      repository.findAll.mockResolvedValue(mockPhases);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 'id1');
      expect(result[0]).toHaveProperty('name', 'Phase 1');
      expect(result[0]).toHaveProperty('color', '#FF0000');
      expect(result[1]).toHaveProperty('id', 'id2');
      expect(result[1]).toHaveProperty('name', 'Phase 2');
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no phases exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a BasePhaseResponseDto when phase exists', async () => {
      const mockPhase = new BasePhase('Phase 1', '#FF0000');
      mockPhase.id = 'id1';

      repository.findById.mockResolvedValue(mockPhase);

      const result = await service.findById('id1');

      expect(result).toHaveProperty('id', 'id1');
      expect(result).toHaveProperty('name', 'Phase 1');
      expect(result).toHaveProperty('color', '#FF0000');
      expect(repository.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when phase does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('non-existent')).rejects.toThrow(
        'Base Phase with id non-existent not found',
      );
      expect(repository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('create', () => {
    const createDto: CreateBasePhaseDto = {
      name: 'New Phase',
      color: '#0000FF',
    };

    it('should create and return a BasePhaseResponseDto', async () => {
      const mockPhase = new BasePhase(createDto.name, createDto.color);
      mockPhase.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.findByColor.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockPhase);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', 'new-id');
      expect(result).toHaveProperty('name', 'New Phase');
      expect(result).toHaveProperty('color', '#0000FF');
      expect(repository.findByName).toHaveBeenCalledWith('New Phase');
      expect(repository.findByColor).toHaveBeenCalledWith('#0000FF');
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when name already exists', async () => {
      const existingPhase = new BasePhase('New Phase', '#FF0000');
      existingPhase.id = 'existing-id';

      repository.findByName.mockResolvedValue(existingPhase);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Base phase with name "New Phase" already exists',
      );
      expect(repository.findByName).toHaveBeenCalledWith('New Phase');
      expect(repository.findByColor).not.toHaveBeenCalled();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when color already exists', async () => {
      const existingPhase = new BasePhase('Other Phase', '#0000FF');
      existingPhase.id = 'existing-id';

      repository.findByName.mockResolvedValue(null);
      repository.findByColor.mockResolvedValue(existingPhase);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Base phase with color "#0000FF" already exists',
      );
      expect(repository.findByName).toHaveBeenCalledWith('New Phase');
      expect(repository.findByColor).toHaveBeenCalledWith('#0000FF');
      expect(repository.create).not.toHaveBeenCalled();
    });

  });

  describe('update', () => {
    const updateDto: UpdateBasePhaseDto = {
      name: 'Updated Phase',
      color: '#00FF00',
    };

    it('should update and return a BasePhaseResponseDto', async () => {
      const existingPhase = new BasePhase('Old Phase', '#FF0000');
      existingPhase.id = 'id1';
      const updatedPhase = new BasePhase('Updated Phase', '#00FF00');
      updatedPhase.id = 'id1';

      repository.findById.mockResolvedValue(existingPhase);
      repository.findByName.mockResolvedValue(null);
      repository.findByColor.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedPhase);

      const result = await service.update('id1', updateDto);

      expect(result).toHaveProperty('id', 'id1');
      expect(result).toHaveProperty('name', 'Updated Phase');
      expect(result).toHaveProperty('color', '#00FF00');
      expect(repository.findById).toHaveBeenCalledWith('id1');
      expect(repository.update).toHaveBeenCalledWith('id1', updateDto);
    });

    it('should throw NotFoundException when phase does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update('non-existent', updateDto)).rejects.toThrow(
        'Base Phase with id non-existent not found',
      );
      expect(repository.findById).toHaveBeenCalledWith('non-existent');
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when new name already exists', async () => {
      const existingPhase = new BasePhase('Old Phase', '#FF0000');
      existingPhase.id = 'id1';
      const conflictingPhase = new BasePhase('Updated Phase', '#FF0000');
      conflictingPhase.id = 'other-id';

      repository.findById.mockResolvedValue(existingPhase);
      repository.findByName.mockResolvedValue(conflictingPhase);

      await expect(service.update('id1', updateDto)).rejects.toThrow(ConflictException);
      await expect(service.update('id1', updateDto)).rejects.toThrow(
        'Base phase with name "Updated Phase" already exists',
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when new color already exists', async () => {
      const existingPhase = new BasePhase('Old Phase', '#FF0000');
      existingPhase.id = 'id1';
      const conflictingPhase = new BasePhase('Other Phase', '#00FF00');
      conflictingPhase.id = 'other-id';

      repository.findById.mockResolvedValue(existingPhase);
      repository.findByName.mockResolvedValue(null);
      repository.findByColor.mockResolvedValue(conflictingPhase);

      await expect(service.update('id1', updateDto)).rejects.toThrow(ConflictException);
      await expect(service.update('id1', updateDto)).rejects.toThrow(
        'Base phase with color "#00FF00" already exists',
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should allow update when name is unchanged', async () => {
      const existingPhase = new BasePhase('Old Phase', '#FF0000');
      existingPhase.id = 'id1';
      const updatedPhase = new BasePhase('Old Phase', '#00FF00');
      updatedPhase.id = 'id1';

      const updateDtoSameName: UpdateBasePhaseDto = {
        name: 'Old Phase',
        color: '#00FF00',
      };

      repository.findById.mockResolvedValue(existingPhase);
      repository.findByColor.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedPhase);

      const result = await service.update('id1', updateDtoSameName);

      expect(result).toHaveProperty('name', 'Old Phase');
      expect(repository.findByName).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should allow update when color is unchanged', async () => {
      const existingPhase = new BasePhase('Old Phase', '#FF0000');
      existingPhase.id = 'id1';
      const updatedPhase = new BasePhase('Updated Phase', '#FF0000');
      updatedPhase.id = 'id1';

      const updateDtoSameColor: UpdateBasePhaseDto = {
        name: 'Updated Phase',
        color: '#FF0000',
      };

      repository.findById.mockResolvedValue(existingPhase);
      repository.findByName.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedPhase);

      const result = await service.update('id1', updateDtoSameColor);

      expect(result).toHaveProperty('color', '#FF0000');
      expect(repository.findByColor).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should update partial fields', async () => {
      const existingPhase = new BasePhase('Old Phase', '#FF0000');
      existingPhase.id = 'id1';
      const updatedPhase = new BasePhase('Updated Phase', '#FF0000');
      updatedPhase.id = 'id1';

      const partialUpdateDto: UpdateBasePhaseDto = {
        name: 'Updated Phase',
      };

      repository.findById.mockResolvedValue(existingPhase);
      repository.findByName.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedPhase);

      const result = await service.update('id1', partialUpdateDto);

      expect(result).toHaveProperty('name', 'Updated Phase');
      expect(repository.update).toHaveBeenCalledWith('id1', partialUpdateDto);
    });
  });

  describe('delete', () => {
    it('should delete phase successfully', async () => {
      repository.exists.mockResolvedValue(true);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('id1');

      expect(repository.exists).toHaveBeenCalledWith('id1');
      expect(repository.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when phase does not exist', async () => {
      repository.exists.mockResolvedValue(false);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
      await expect(service.delete('non-existent')).rejects.toThrow(
        'Base Phase with id non-existent not found',
      );
      expect(repository.exists).toHaveBeenCalledWith('non-existent');
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});

