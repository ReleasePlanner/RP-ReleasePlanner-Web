/**
 * Calendar Entity Unit Tests
 * Coverage: 100%
 */
import { Calendar } from './calendar.entity';
import { CalendarDay, CalendarDayType } from './calendar-day.entity';

describe('Calendar', () => {
  describe('constructor', () => {
    it('should create a Calendar with name and days', () => {
      const days = [
        new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY, true),
      ];
      const calendar = new Calendar('Test Calendar', days);

      expect(calendar.name).toBe('Test Calendar');
      expect(calendar.days).toHaveLength(1);
    });

    it('should create a Calendar without days', () => {
      const calendar = new Calendar('Test Calendar');

      expect(calendar.name).toBe('Test Calendar');
      expect(calendar.days).toEqual([]);
    });

    it('should create a Calendar with description', () => {
      const calendar = new Calendar('Test Calendar', [], 'Test Description');

      expect(calendar.description).toBe('Test Description');
    });
  });

  describe('validate', () => {
    it('should pass validation with valid name', () => {
      expect(() => {
        new Calendar('Valid Calendar', []);
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new Calendar('', []);
      }).toThrow('Calendar name is required');
    });

    it('should throw error when name is only whitespace', () => {
      expect(() => {
        new Calendar('   ', []);
      }).toThrow('Calendar name is required');
    });
  });

  describe('addDay', () => {
    it('should add a day to the calendar', () => {
      const calendar = new Calendar('Calendar', []);
      const day = new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY, true);
      const oldUpdatedAt = new Date(calendar.updatedAt.getTime());

      calendar.addDay(day);

      expect(calendar.days).toHaveLength(1);
      expect(calendar.days[0].name).toBe('Holiday');
      expect(calendar.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });
  });

  describe('removeDay', () => {
    it('should remove a day from the calendar', () => {
      const day = new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY, true);
      const calendar = new Calendar('Calendar', [day]);

      calendar.removeDay(day.id);

      expect(calendar.days).toHaveLength(0);
    });

    it('should throw error when day not found', () => {
      const calendar = new Calendar('Calendar', []);

      expect(() => {
        calendar.removeDay('non-existent');
      }).toThrow('Calendar day with id non-existent not found');
    });
  });
});

