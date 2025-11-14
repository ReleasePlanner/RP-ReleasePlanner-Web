import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('calendars')
@Index(['name'], { unique: true })
export class Calendar extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => require('./calendar-day.entity').CalendarDay, (day: any) => day.calendar, {
    cascade: true,
    eager: false,
  })
  days?: any[];

  constructor(name?: string, days?: any[], description?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (days !== undefined) {
      this.days = days;
    }
    // Don't initialize days array - TypeORM will handle it
    if (description !== undefined) {
      this.description = description;
    }
    if (name !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Calendar name is required');
    }
  }

  addDay(day: any): void {
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
