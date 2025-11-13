import { BaseEntity } from '../../common/base/base.entity';

export enum CalendarDayType {
  HOLIDAY = 'holiday',
  SPECIAL = 'special',
}

export class CalendarDay extends BaseEntity {
  name: string;
  date: string; // YYYY-MM-DD format
  type: CalendarDayType;
  description?: string;
  recurring: boolean;

  constructor(
    name: string,
    date: string,
    type: CalendarDayType,
    recurring: boolean,
    description?: string,
  ) {
    super();
    this.name = name;
    this.date = date;
    this.type = type;
    this.recurring = recurring;
    this.description = description;
    this.validate();
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Calendar day name is required');
    }
    if (!this.date || !this.isValidDate(this.date)) {
      throw new Error('Valid date in YYYY-MM-DD format is required');
    }
    if (!Object.values(CalendarDayType).includes(this.type)) {
      throw new Error(`Invalid calendar day type: ${this.type}`);
    }
  }

  private isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
      return false;
    }
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }
}

