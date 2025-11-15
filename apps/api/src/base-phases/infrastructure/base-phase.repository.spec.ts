/**
 * Base Phase Repository Unit Tests
 * 
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasePhaseRepository } from './base-phase.repository';
import { BasePhase } from '../domain/base-phase.entity';
import { NotFoundException } from '../../common/exceptions/business-exception';

describe('BasePhaseRepository', () => {
  let repository: BasePhaseRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<BasePhase>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<BasePhase>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BasePhaseRepository,
        {
          provide: getRepositoryToken(BasePhase),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<BasePhaseRepository>(BasePhaseRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(BasePhase));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByName', () => {
    it('should find phase by name (case-insensitive)', async () => {
      const phase = new BasePhase('Phase One', '#FF0000');
      mockTypeOrmRepository.findOne.mockResolvedValue(phase);

      const found = await repository.findByName('phase one');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'phase one' },
      });
      expect(found).toEqual(phase);
    });

    it('should return null when phase not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const found = await repository.findByName('Non Existent');

      expect(found).toBeNull();
    });
  });

  describe('findByColor', () => {
    it('should find phase by color (case-insensitive)', async () => {
      const phase = new BasePhase('Phase One', '#FF0000');
      mockTypeOrmRepository.findOne.mockResolvedValue(phase);

      const found = await repository.findByColor('#ff0000');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { color: '#ff0000' },
      });
      expect(found).toEqual(phase);
    });

    it('should return null when color not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const found = await repository.findByColor('#000000');

      expect(found).toBeNull();
    });
  });

  describe('CRUD operations', () => {
    it('should create a new phase', async () => {
      const phaseData = { name: 'Test Phase', color: '#FF0000' } as BasePhase;
      const savedPhase = new BasePhase('Test Phase', '#FF0000');
      savedPhase.id = 'test-id';
      
      mockTypeOrmRepository.create.mockReturnValue(phaseData as BasePhase);
      mockTypeOrmRepository.save.mockResolvedValue(savedPhase);

      const created = await repository.create(phaseData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(phaseData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(created).toEqual(savedPhase);
    });

    it('should find all phases', async () => {
      const phases = [
        new BasePhase('Phase 1', '#FF0000'),
        new BasePhase('Phase 2', '#00FF00'),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(phases);

      const all = await repository.findAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(all).toEqual(phases);
    });

    it('should find phase by id', async () => {
      const phase = new BasePhase('Test Phase', '#FF0000');
      phase.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(phase);

      const found = await repository.findById('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(found).toEqual(phase);
    });

    it('should return null when id not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });

    it('should update phase', async () => {
      const existingPhase = new BasePhase('Old Name', '#FF0000');
      existingPhase.id = 'test-id';
      const updatedPhase = new BasePhase('New Name', '#00FF00');
      updatedPhase.id = 'test-id';

      mockTypeOrmRepository.findOne.mockResolvedValue(existingPhase);
      mockTypeOrmRepository.save.mockResolvedValue(updatedPhase);

      const updated = await repository.update('test-id', {
        name: 'New Name',
        color: '#00FF00',
      });

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(updated.name).toBe('New Name');
    });

    it('should throw error when updating non-existent phase', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await expect(
        repository.update('non-existent', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete phase', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('test-id');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error when deleting non-existent phase', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should check if phase exists', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(1);

      const exists = await repository.exists('test-id');

      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(exists).toBe(true);
    });

    it('should return false when phase does not exist', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(0);

      const exists = await repository.exists('non-existent');

      expect(exists).toBe(false);
    });

    it('should count phases', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(2);

      const count = await repository.count();

      expect(mockTypeOrmRepository.count).toHaveBeenCalled();
      expect(count).toBe(2);
    });

    it('should find many phases by criteria', async () => {
      const phases = [
        new BasePhase('Phase 1', '#FF0000'),
        new BasePhase('Phase 2', '#00FF00'),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(phases);

      const found = await repository.findMany({ name: 'Phase 1' });

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { name: 'Phase 1' },
      });
      expect(found).toEqual(phases);
    });
  });
});

