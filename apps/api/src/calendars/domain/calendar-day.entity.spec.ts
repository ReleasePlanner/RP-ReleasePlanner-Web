/**
 * Calendar Day Entity Unit Tests
 * Coverage: 100%
 */
import { CalendarDay, CalendarDayType } from './calendar-day.entity';

describe('CalendarDay', () => {
  describe('constructor', () => {
    it('should create a CalendarDay with all properties', () => {
      const day = new CalendarDay('New Year', '2024-01-01', CalendarDayType.HOLIDAY, true, 'New Year celebration');

      expect(day.name).toBe('New Year');
      expect(day.date).toBe('2024-01-01');
      expect(day.type).toBe(CalendarDayType.HOLIDAY);
      expect(day.recurring).toBe(true);
      expect(day.description).toBe('New Year celebration');
    });

    it('should create a CalendarDay without description', () => {
      const day = new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY, true);

      expect(day.description).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY, true);
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new CalendarDay('', '2024-01-01', CalendarDayType.HOLIDAY, true);
      }).toThrow('Calendar day name is required');
    });

    it('should throw error when date format is invalid', () => {
      expect(() => {
        new CalendarDay('Holiday', 'invalid-date', CalendarDayType.HOLIDAY, true);
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });

    it('should throw error when date is empty', () => {
      expect(() => {
        new CalendarDay('Holiday', '', CalendarDayType.HOLIDAY, true);
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });

    it('should throw error when type is invalid', () => {
      expect(() => {
        new CalendarDay('Holiday', '2024-01-01', 'invalid' as CalendarDayType, true);
      }).toThrow('Invalid calendar day type: invalid');
    });

    it('should accept valid date formats', () => {
      expect(() => {
        new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY, true);
      }).not.toThrow();
      expect(() => {
        new CalendarDay('Holiday', '2024-12-31', CalendarDayType.SPECIAL, false);
      }).not.toThrow();
    });

    it('should accept all valid day types', () => {
      expect(() => {
        new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY, true);
      }).not.toThrow();
      expect(() => {
        new CalendarDay('Special', '2024-01-01', CalendarDayType.SPECIAL, false);
      }).not.toThrow();
    });
  });
});

