/**
 * Calendar Service Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { ICalendarRepository } from '../infrastructure/calendar.repository';
import { Calendar } from '../domain/calendar.entity';
import { CalendarDay, CalendarDayType } from '../domain/calendar-day.entity';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

describe('CalendarService', () => {
  let service: CalendarService;
  let repository: jest.Mocked<ICalendarRepository>;

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
        CalendarService,
        {
          provide: 'ICalendarRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    repository = module.get('ICalendarRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of CalendarResponseDto', async () => {
      const mockCalendars = [
        new Calendar('Calendar 1', [new CalendarDay('Day 1', '2024-01-01', CalendarDayType.HOLIDAY, true)]),
        new Calendar('Calendar 2', []),
      ];
      mockCalendars[0].id = 'id1';
      mockCalendars[1].id = 'id2';

      repository.findAll.mockResolvedValue(mockCalendars);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 'id1');
      expect(result[0]).toHaveProperty('name', 'Calendar 1');
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a CalendarResponseDto when calendar exists', async () => {
      const mockCalendar = new Calendar('Calendar 1', []);
      mockCalendar.id = 'id1';

      repository.findById.mockResolvedValue(mockCalendar);

      const result = await service.findById('id1');

      expect(result).toHaveProperty('id', 'id1');
      expect(result).toHaveProperty('name', 'Calendar 1');
      expect(repository.findById).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when calendar does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('create', () => {
    const createDto: CreateCalendarDto = {
      name: 'New Calendar',
      days: [
        {
          name: 'New Year',
          date: '2024-01-01',
          type: CalendarDayType.HOLIDAY,
          recurring: true,
        },
      ],
    };

    it('should create and return a CalendarResponseDto', async () => {
      const mockCalendar = new Calendar('New Calendar', [
        new CalendarDay('New Year', '2024-01-01', CalendarDayType.HOLIDAY, true),
      ]);
      mockCalendar.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockCalendar);

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id', 'new-id');
      expect(result).toHaveProperty('name', 'New Calendar');
      expect(result.days).toHaveLength(1);
      expect(repository.findByName).toHaveBeenCalledWith('New Calendar');
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when name already exists', async () => {
      const existingCalendar = new Calendar('New Calendar', []);
      existingCalendar.id = 'existing-id';

      repository.findByName.mockResolvedValue(existingCalendar);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should create calendar without days', async () => {
      const createDtoNoDays: CreateCalendarDto = {
        name: 'Calendar Without Days',
      };
      const mockCalendar = new Calendar('Calendar Without Days', []);
      mockCalendar.id = 'new-id';

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockCalendar);

      const result = await service.create(createDtoNoDays);

      expect(result.days).toEqual([]);
    });
  });

  describe('update', () => {
    const updateDto: UpdateCalendarDto = {
      name: 'Updated Calendar',
    };

    it('should update and return a CalendarResponseDto', async () => {
      const existingCalendar = new Calendar('Old Calendar', []);
      existingCalendar.id = 'id1';
      const updatedCalendar = new Calendar('Updated Calendar', []);
      updatedCalendar.id = 'id1';

      repository.findById.mockResolvedValue(existingCalendar);
      repository.findByName.mockResolvedValue(null);
      repository.update.mockResolvedValue(updatedCalendar);

      const result = await service.update('id1', updateDto);

      expect(result).toHaveProperty('name', 'Updated Calendar');
      expect(repository.findById).toHaveBeenCalledWith('id1');
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when calendar does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new name already exists', async () => {
      const existingCalendar = new Calendar('Old Calendar', []);
      existingCalendar.id = 'id1';
      const conflictingCalendar = new Calendar('Updated Calendar', []);
      conflictingCalendar.id = 'other-id';

      repository.findById.mockResolvedValue(existingCalendar);
      repository.findByName.mockResolvedValue(conflictingCalendar);

      await expect(service.update('id1', updateDto)).rejects.toThrow(ConflictException);
    });

    it('should allow update when name is unchanged', async () => {
      const existingCalendar = new Calendar('Old Calendar', []);
      existingCalendar.id = 'id1';
      const updatedCalendar = new Calendar('Old Calendar', []);
      updatedCalendar.id = 'id1';

      const updateDtoSameName: UpdateCalendarDto = {
        name: 'Old Calendar',
      };

      repository.findById.mockResolvedValue(existingCalendar);
      repository.update.mockResolvedValue(updatedCalendar);

      const result = await service.update('id1', updateDtoSameName);

      expect(result).toHaveProperty('name', 'Old Calendar');
      expect(repository.findByName).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });

    it('should allow update without name', async () => {
      const existingCalendar = new Calendar('Old Calendar', []);
      existingCalendar.id = 'id1';
      const updatedCalendar = new Calendar('Old Calendar', []);
      updatedCalendar.id = 'id1';

      const updateDtoNoName: UpdateCalendarDto = {
        description: 'New Description',
      };

      repository.findById.mockResolvedValue(existingCalendar);
      repository.update.mockResolvedValue(updatedCalendar);

      const result = await service.update('id1', updateDtoNoName);

      expect(result).toHaveProperty('name', 'Old Calendar');
      expect(repository.findByName).not.toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete calendar successfully', async () => {
      repository.exists.mockResolvedValue(true);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('id1');

      expect(repository.exists).toHaveBeenCalledWith('id1');
      expect(repository.delete).toHaveBeenCalledWith('id1');
    });

    it('should throw NotFoundException when calendar does not exist', async () => {
      repository.exists.mockResolvedValue(false);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});

