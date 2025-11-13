import { Calendar } from '../../domain/calendar.entity';
import { CalendarDay } from '../../domain/calendar-day.entity';

export class CalendarDayResponseDto {
  id: string;
  name: string;
  date: string;
  type: string;
  description?: string;
  recurring: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: CalendarDay) {
    this.id = entity.id;
    this.name = entity.name;
    this.date = entity.date;
    this.type = entity.type;
    this.description = entity.description;
    this.recurring = entity.recurring;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class CalendarResponseDto {
  id: string;
  name: string;
  description?: string;
  days: CalendarDayResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Calendar) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.days = entity.days.map((day) => new CalendarDayResponseDto(day));
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

