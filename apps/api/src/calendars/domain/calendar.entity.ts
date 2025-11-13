import { BaseEntity } from '../../common/base/base.entity';
import { CalendarDay } from './calendar-day.entity';

export class Calendar extends BaseEntity {
  name: string;
  description?: string;
  days: CalendarDay[];

  constructor(name: string, days: CalendarDay[] = [], description?: string) {
    super();
    this.name = name;
    this.description = description;
    this.days = days;
    this.validate();
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Calendar name is required');
    }
  }

  addDay(day: CalendarDay): void {
    this.days.push(day);
    this.touch();
  }

  removeDay(dayId: string): void {
    const index = this.days.findIndex((d) => d.id === dayId);
    if (index === -1) {
      throw new Error(`Calendar day with id ${dayId} not found`);
    }
    this.days.splice(index, 1);
    this.touch();
  }
}

