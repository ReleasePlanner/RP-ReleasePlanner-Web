/**
 * Calendar Response DTO Tests
 * Coverage: 100%
 */
import { Calendar } from '../../domain/calendar.entity';
import { CalendarDay } from '../../domain/calendar-day.entity';
import { CalendarDayResponseDto, CalendarResponseDto } from './calendar-response.dto';

describe('CalendarResponseDto', () => {
  describe('CalendarDayResponseDto', () => {
    it('should create DTO from entity', () => {
      const day = new CalendarDay('Holiday', '2024-01-01', 'holiday', true, 'Description');
      day.id = 'day-id';
      day.createdAt = new Date();
      day.updatedAt = new Date();

      const dto = new CalendarDayResponseDto(day);

      expect(dto.id).toBe('day-id');
      expect(dto.name).toBe('Holiday');
      expect(dto.date).toBe('2024-01-01');
      expect(dto.type).toBe('holiday');
      expect(dto.description).toBe('Description');
      expect(dto.recurring).toBe(true);
      expect(dto.createdAt).toBe(day.createdAt);
      expect(dto.updatedAt).toBe(day.updatedAt);
    });

    it('should handle optional description', () => {
      const day = new CalendarDay('Holiday', '2024-01-01', 'holiday', false);
      day.id = 'day-id';
      day.createdAt = new Date();
      day.updatedAt = new Date();

      const dto = new CalendarDayResponseDto(day);

      expect(dto.description).toBeUndefined();
    });
  });

  describe('CalendarResponseDto', () => {
    it('should create DTO from calendar entity with days', () => {
      const day1 = new CalendarDay('Holiday 1', '2024-01-01', 'holiday');
      day1.id = 'day-1';
      day1.createdAt = new Date();
      day1.updatedAt = new Date();

      const day2 = new CalendarDay('Holiday 2', '2024-12-25', 'holiday');
      day2.id = 'day-2';
      day2.createdAt = new Date();
      day2.updatedAt = new Date();

      const calendar = new Calendar('Calendar 1', [day1, day2], 'Description');
      calendar.id = 'calendar-id';
      calendar.createdAt = new Date();
      calendar.updatedAt = new Date();

      const dto = new CalendarResponseDto(calendar);

      expect(dto.id).toBe('calendar-id');
      expect(dto.name).toBe('Calendar 1');
      expect(dto.description).toBe('Description');
      expect(dto.days).toHaveLength(2);
      expect(dto.days[0].id).toBe('day-1');
      expect(dto.days[0].name).toBe('Holiday 1');
      expect(dto.days[1].id).toBe('day-2');
      expect(dto.days[1].name).toBe('Holiday 2');
      expect(dto.createdAt).toBe(calendar.createdAt);
      expect(dto.updatedAt).toBe(calendar.updatedAt);
    });

    it('should handle empty days array', () => {
      const calendar = new Calendar('Calendar 1');
      calendar.id = 'calendar-id';
      calendar.days = [];
      calendar.createdAt = new Date();
      calendar.updatedAt = new Date();

      const dto = new CalendarResponseDto(calendar);

      expect(dto.days).toEqual([]);
    });

    it('should handle optional description', () => {
      const calendar = new Calendar('Calendar 1');
      calendar.id = 'calendar-id';
      calendar.createdAt = new Date();
      calendar.updatedAt = new Date();

      const dto = new CalendarResponseDto(calendar);

      expect(dto.description).toBeUndefined();
    });
  });
});

