/**
 * IT Owner Controller Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ITOwnerController } from './it-owner.controller';
import { ITOwnerService } from '../application/it-owner.service';
import { CreateITOwnerDto } from '../application/dto/create-it-owner.dto';
import { UpdateITOwnerDto } from '../application/dto/update-it-owner.dto';
import { ITOwnerResponseDto } from '../application/dto/it-owner-response.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('ITOwnerController', () => {
  let controller: ITOwnerController;
  let service: jest.Mocked<ITOwnerService>;

  const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ITOwnerController],
      providers: [
        {
          provide: ITOwnerService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ITOwnerController>(ITOwnerController);
    service = module.get(ITOwnerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of ITOwnerResponseDto', async () => {
      const mockResponse: ITOwnerResponseDto[] = [
        {
          id: 'id1',
          name: 'Owner 1',
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
    it('should return a ITOwnerResponseDto', async () => {
      const mockResponse: ITOwnerResponseDto = {
        id: 'id1',
        name: 'Owner 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(mockResponse);

      const result = await controller.findById('id1');

      expect(result).toEqual(mockResponse);
      expect(service.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when owner does not exist', async () => {
      service.findById.mockRejectedValue(new NotFoundException('IT Owner', 'non-existent'));

      await expect(controller.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateITOwnerDto = { name: 'New Owner' };

    it('should create and return a ITOwnerResponseDto', async () => {
      const mockResponse: ITOwnerResponseDto = {
        id: 'new-id',
        name: 'New Owner',
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
        new ConflictException('IT Owner with name "New Owner" already exists', 'DUPLICATE_IT_OWNER_NAME'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateITOwnerDto = { name: 'Updated Owner' };

    it('should update and return a ITOwnerResponseDto', async () => {
      const mockResponse: ITOwnerResponseDto = {
        id: 'id1',
        name: 'Updated Owner',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(mockResponse);

      const result = await controller.update('id1', updateDto);

      expect(result).toEqual(mockResponse);
      expect(service.update).toHaveBeenCalledWith('id1', updateDto);
    });

    it('should throw NotFoundException when owner does not exist', async () => {
      service.update.mockRejectedValue(new NotFoundException('IT Owner', 'non-existent'));

      await expect(controller.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete owner successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('id1');

      expect(service.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when owner does not exist', async () => {
      service.delete.mockRejectedValue(new NotFoundException('IT Owner', 'non-existent'));

      await expect(controller.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});

