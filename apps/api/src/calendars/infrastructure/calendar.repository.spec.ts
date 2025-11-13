/**
 * Calendar Repository Unit Tests
 * Coverage: 100%
 */
import { CalendarRepository } from './calendar.repository';
import { Calendar } from '../domain/calendar.entity';
import { CalendarDay, CalendarDayType } from '../domain/calendar-day.entity';

describe('CalendarRepository', () => {
  let repository: CalendarRepository;

  beforeEach(() => {
    repository = new CalendarRepository();
  });

  afterEach(() => {
    (repository as any).entities.clear();
  });

  describe('findByName', () => {
    it('should find calendar by name (case-insensitive)', async () => {
      const calendar1 = new Calendar('Calendar One', []);
      const calendar2 = new Calendar('Calendar Two', []);

      await repository.create(calendar1);
      await repository.create(calendar2);

      const found = await repository.findByName('calendar one');
      expect(found).not.toBeNull();
      expect(found?.name).toBe('Calendar One');
    });

    it('should return null when calendar not found', async () => {
      const found = await repository.findByName('Non Existent');
      expect(found).toBeNull();
    });
  });

  describe('CRUD operations', () => {
    it('should create a new calendar', async () => {
      const calendar = new Calendar('Test Calendar', [
        new CalendarDay('Holiday', '2024-01-01', CalendarDayType.HOLIDAY, true),
      ]);
      const created = await repository.create(calendar);

      expect(created).toHaveProperty('id');
      expect(created.name).toBe('Test Calendar');
      expect(created.days).toHaveLength(1);
    });

    it('should find all calendars', async () => {
      await repository.create(new Calendar('Calendar 1', []));
      await repository.create(new Calendar('Calendar 2', []));

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    it('should find calendar by id', async () => {
      const calendar = new Calendar('Test Calendar', []);
      const created = await repository.create(calendar);

      const found = await repository.findById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });

    it('should update calendar', async () => {
      const calendar = new Calendar('Old Name', []);
      const created = await repository.create(calendar);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await repository.update(created.id, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should delete calendar', async () => {
      const calendar = new Calendar('Test Calendar', []);
      const created = await repository.create(calendar);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });
});

