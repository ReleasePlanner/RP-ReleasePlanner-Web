/**
 * Calendar Controller Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from '../application/calendar.service';
import { CreateCalendarDto } from '../application/dto/create-calendar.dto';
import { UpdateCalendarDto } from '../application/dto/update-calendar.dto';
import { CalendarResponseDto } from '../application/dto/calendar-response.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('CalendarController', () => {
  let controller: CalendarController;
  let service: jest.Mocked<CalendarService>;

  const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        {
          provide: CalendarService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CalendarController>(CalendarController);
    service = module.get(CalendarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of CalendarResponseDto', async () => {
      const mockResponse: CalendarResponseDto[] = [
        {
          id: 'id1',
          name: 'Calendar 1',
          days: [],
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
    it('should return a CalendarResponseDto', async () => {
      const mockResponse: CalendarResponseDto = {
        id: 'id1',
        name: 'Calendar 1',
        days: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findById.mockResolvedValue(mockResponse);

      const result = await controller.findById('id1');

      expect(result).toEqual(mockResponse);
      expect(service.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when calendar does not exist', async () => {
      service.findById.mockRejectedValue(new NotFoundException('Calendar', 'non-existent'));

      await expect(controller.findById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto: CreateCalendarDto = {
      name: 'New Calendar',
    };

    it('should create and return a CalendarResponseDto', async () => {
      const mockResponse: CalendarResponseDto = {
        id: 'new-id',
        name: 'New Calendar',
        days: [],
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
        new ConflictException('Calendar with name "New Calendar" already exists', 'DUPLICATE_CALENDAR_NAME'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateCalendarDto = {
      name: 'Updated Calendar',
    };

    it('should update and return a CalendarResponseDto', async () => {
      const mockResponse: CalendarResponseDto = {
        id: 'id1',
        name: 'Updated Calendar',
        days: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.update.mockResolvedValue(mockResponse);

      const result = await controller.update('id1', updateDto);

      expect(result).toEqual(mockResponse);
      expect(service.update).toHaveBeenCalledWith('id1', updateDto);
    });

    it('should throw NotFoundException when calendar does not exist', async () => {
      service.update.mockRejectedValue(new NotFoundException('Calendar', 'non-existent'));

      await expect(controller.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete calendar successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('id1');

      expect(service.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when calendar does not exist', async () => {
      service.delete.mockRejectedValue(new NotFoundException('Calendar', 'non-existent'));

      await expect(controller.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});

