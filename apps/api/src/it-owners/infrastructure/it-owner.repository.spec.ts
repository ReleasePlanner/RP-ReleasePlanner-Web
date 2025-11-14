/**
 * IT Owner Repository Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITOwnerRepository } from './it-owner.repository';
import { ITOwner } from '../domain/it-owner.entity';
import { NotFoundException } from '../../common/exceptions/business-exception';

describe('ITOwnerRepository', () => {
  let repository: ITOwnerRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<ITOwner>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<ITOwner>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ITOwnerRepository,
        {
          provide: getRepositoryToken(ITOwner),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<ITOwnerRepository>(ITOwnerRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(ITOwner));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByName', () => {
    it('should find owner by name', async () => {
      const owner = new ITOwner('Owner One');
      mockTypeOrmRepository.findOne.mockResolvedValue(owner);

      const found = await repository.findByName('Owner One');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Owner One' },
      });
      expect(found).toEqual(owner);
    });

    it('should return null when owner not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const found = await repository.findByName('Non Existent');

      expect(found).toBeNull();
    });
  });

  describe('CRUD operations', () => {
    it('should create a new owner', async () => {
      const ownerData = { name: 'Test Owner' } as ITOwner;
      const savedOwner = new ITOwner('Test Owner');
      savedOwner.id = 'test-id';
      
      mockTypeOrmRepository.create.mockReturnValue(ownerData as ITOwner);
      mockTypeOrmRepository.save.mockResolvedValue(savedOwner);

      const created = await repository.create(ownerData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(ownerData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(created).toEqual(savedOwner);
    });

    it('should find all owners', async () => {
      const owners = [
        new ITOwner('Owner 1'),
        new ITOwner('Owner 2'),
      ];
      mockTypeOrmRepository.find.mockResolvedValue(owners);

      const all = await repository.findAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(all).toEqual(owners);
    });

    it('should find owner by id', async () => {
      const owner = new ITOwner('Test Owner');
      owner.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(owner);

      const found = await repository.findById('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(found).toEqual(owner);
    });

    it('should update owner', async () => {
      const existingOwner = new ITOwner('Old Name');
      existingOwner.id = 'test-id';
      const updatedOwner = new ITOwner('New Name');
      updatedOwner.id = 'test-id';

      mockTypeOrmRepository.findOne.mockResolvedValue(existingOwner);
      mockTypeOrmRepository.save.mockResolvedValue(updatedOwner);

      const updated = await repository.update('test-id', { name: 'New Name' });

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(updated.name).toBe('New Name');
    });

    it('should throw error when updating non-existent owner', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await expect(
        repository.update('non-existent', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete owner', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('test-id');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error when deleting non-existent owner', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
