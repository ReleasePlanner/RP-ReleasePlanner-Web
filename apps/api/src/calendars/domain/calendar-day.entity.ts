import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { Calendar } from './calendar.entity';

export enum CalendarDayType {
  HOLIDAY = 'holiday',
  SPECIAL = 'special',
}

@Entity('calendar_days')
@Index(['calendarId', 'date'])
export class CalendarDay extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD format

  @Column({ type: 'enum', enum: CalendarDayType })
  type: CalendarDayType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  recurring: boolean;

  @Column({ type: 'uuid' })
  calendarId: string;

  @ManyToOne(() => Calendar, (calendar) => calendar.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'calendarId' })
  calendar: Calendar;

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
