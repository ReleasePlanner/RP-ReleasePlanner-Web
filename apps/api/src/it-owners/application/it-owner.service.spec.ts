/**
 * IT Owner Service Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ITOwnerService } from './it-owner.service';
import { IITOwnerRepository } from '../infrastructure/it-owner.repository';
import { ITOwner } from '../domain/it-owner.entity';
import { CreateITOwnerDto } from './dto/create-it-owner.dto';
import { UpdateITOwnerDto } from './dto/update-it-owner.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('ITOwnerService', () => {
  let service: ITOwnerService;
  let repository: jest.Mocked<IITOwnerRepository>;

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
        ITOwnerService,
        {
          provide: 'IITOwnerRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ITOwnerService>(ITOwnerService);
    repository = module.get('IITOwnerRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of ITOwnerResponseDto', async () => {
      const mockOwners = [new ITOwner('Owner 1'), new ITOwner('Owner 2')];
      mockOwners[0].id = 'id1';
      mockOwners[1].id = 'id2';

      repository.findAll.mockResolvedValue(mockOwners);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 'id1');
      expect(result[0]).toHaveProperty('name', 'Owner 1');
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a ITOwnerResponseDto when owner exists', async () => {
      const mockOwner = new ITOwner('Owner 1');
      mockOwner.id = 'id1';

      repository.findById.mockResolvedValue(mockOwner);

      const result = await service.findById('id1');

      expect(result).toHaveProperty('id', 'id1');
      expect(result).toHaveProperty('name', 'Owner 1');
      expect(repository.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when owner does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('create', () => {
    const createDto: CreateITOwnerDto = { name: 'New Owner' };

    it('should create and return a ITOwnerResponseDto', async () => {
      const mockOwner = new ITOwner('New Owner');
      mockOwner.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockOwner);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', 'new-id');
      expect(result).toHaveProperty('name', 'New Owner');
      expect(repository.findByName).toHaveBeenCalledWith('New Owner');
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when name already exists', async () => {
      const existingOwner = new ITOwner('New Owner');
      existingOwner.id = 'existing-id';

      repository.findByName.mockResolvedValue(existingOwner);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdateITOwnerDto = { name: 'Updated Owner' };

    it('should update and return a ITOwnerResponseDto', async () => {
      const existingOwner = new ITOwner('Old Owner');
      existingOwner.id = 'id1';
      const updatedOwner = new ITOwner('Updated Owner');
      updatedOwner.id = 'id1';

      repository.findById.mockResolvedValue(existingOwner);
      repository.findByName.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedOwner);

      const result = await service.update('id1', updateDto);

      expect(result).toHaveProperty('name', 'Updated Owner');
      expect(repository.findById).toHaveBeenCalledWith('id1');
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when owner does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new name already exists', async () => {
      const existingOwner = new ITOwner('Old Owner');
      existingOwner.id = 'id1';
      const conflictingOwner = new ITOwner('Updated Owner');
      conflictingOwner.id = 'other-id';

      repository.findById.mockResolvedValue(existingOwner);
      repository.findByName.mockResolvedValue(conflictingOwner);

      await expect(service.update('id1', updateDto)).rejects.toThrow(ConflictException);
    });

    it('should allow update when name is unchanged', async () => {
      const existingOwner = new ITOwner('Old Owner');
      existingOwner.id = 'id1';
      const updatedOwner = new ITOwner('Old Owner');
      updatedOwner.id = 'id1';

      const updateDtoSameName: UpdateITOwnerDto = {
        name: 'Old Owner',
      };

      repository.findById.mockResolvedValue(existingOwner);
      repository.update.mockResolvedValue(updatedOwner);

      const result = await service.update('id1', updateDtoSameName);

      expect(result).toHaveProperty('name', 'Old Owner');
      expect(repository.findByName).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should allow update without name', async () => {
      const existingOwner = new ITOwner('Old Owner');
      existingOwner.id = 'id1';
      const updatedOwner = new ITOwner('Old Owner');
      updatedOwner.id = 'id1';

      const updateDtoNoName: UpdateITOwnerDto = {};

      repository.findById.mockResolvedValue(existingOwner);
      repository.update.mockResolvedValue(updatedOwner);

      const result = await service.update('id1', updateDtoNoName);

      expect(result).toHaveProperty('name', 'Old Owner');
      expect(repository.findByName).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete owner successfully', async () => {
      repository.exists.mockResolvedValue(true);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('id1');

      expect(repository.exists).toHaveBeenCalledWith('id1');
      expect(repository.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when owner does not exist', async () => {
      repository.exists.mockResolvedValue(false);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});

