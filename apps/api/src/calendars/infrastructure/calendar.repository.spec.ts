/**
 * Calendar Repository Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarRepository } from './calendar.repository';
import { Calendar } from '../domain/calendar.entity';
import { CalendarDay, CalendarDayType } from '../domain/calendar-day.entity';
import { NotFoundException } from '../../common/exceptions/business-exception';

describe('CalendarRepository', () => {
  let repository: CalendarRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<Calendar>>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<Repository<Calendar>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarRepository,
        {
          provide: getRepositoryToken(Calendar),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<CalendarRepository>(CalendarRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(Calendar));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByName', () => {
    it('should find calendar by name', async () => {
      const calendar = new Calendar('Calendar One');
      calendar.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(calendar);

      const result = await repository.findByName('Calendar One');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Calendar One' },
      });
      expect(result).toEqual(calendar);
    });

    it('should return null when calendar not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByName('Non Existent');

      expect(result).toBeNull();
    });
  });

  describe('findWithDays', () => {
    it('should find calendar with days', async () => {
      const day = new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY);
      const calendar = new Calendar('Calendar', [day]);
      calendar.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(calendar);

      const result = await repository.findWithDays('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['days'],
      });
      expect(result).toEqual(calendar);
    });

    it('should return null when calendar not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findWithDays('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should use findWithDays', async () => {
      const day = new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY);
      const calendar = new Calendar('Calendar', [day]);
      calendar.id = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(calendar);

      const result = await repository.findById('test-id');

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['days'],
      });
      expect(result).toEqual(calendar);
    });
  });

  describe('CRUD operations', () => {
    it('should create a new calendar', async () => {
      const calendarData = { name: 'Test Calendar' } as Calendar;
      const savedCalendar = new Calendar('Test Calendar');
      savedCalendar.id = 'test-id';

      mockTypeOrmRepository.create.mockReturnValue(calendarData as Calendar);
      mockTypeOrmRepository.save.mockResolvedValue(savedCalendar);

      const created = await repository.create(calendarData);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(calendarData);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(created).toEqual(savedCalendar);
    });

    it('should find all calendars', async () => {
      const calendars = [new Calendar('Calendar 1'), new Calendar('Calendar 2')];
      mockTypeOrmRepository.find.mockResolvedValue(calendars);

      const result = await repository.findAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalled();
      expect(result).toEqual(calendars);
    });

    it('should update calendar', async () => {
      const existingCalendar = new Calendar('Old Name');
      existingCalendar.id = 'test-id';
      const updatedCalendar = new Calendar('New Name');
      updatedCalendar.id = 'test-id';

      mockTypeOrmRepository.findOne.mockResolvedValue(existingCalendar);
      mockTypeOrmRepository.save.mockResolvedValue(updatedCalendar);

      const result = await repository.update('test-id', { name: 'New Name' } as any);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('New Name');
    });

    it('should throw error when updating non-existent calendar', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('non-existent', { name: 'New Name' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should delete calendar', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('test-id');

      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error when deleting non-existent calendar', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
