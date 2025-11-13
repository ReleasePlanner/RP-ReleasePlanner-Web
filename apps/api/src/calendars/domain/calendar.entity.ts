import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { CalendarDay } from './calendar-day.entity';

@Entity('calendars')
@Index(['name'], { unique: true })
export class Calendar extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => CalendarDay, (day) => day.calendar, {
    cascade: true,
    eager: false,
  })
  days: CalendarDay[];

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Calendar name is required');
    }
  }

  addDay(day: CalendarDay): void {
    if (!this.days) {
      this.days = [];
    }
    day.calendarId = this.id;
    this.days.push(day);
    this.touch();
  }

  removeDay(dayId: string): void {
    if (!this.days) {
      throw new Error('No days available');
    }
    const index = this.days.findIndex((d) => d.id === dayId);
    if (index === -1) {
      throw new Error(`Calendar day with id ${dayId} not found`);
    }
    this.days.splice(index, 1);
    this.touch();
  }
}
