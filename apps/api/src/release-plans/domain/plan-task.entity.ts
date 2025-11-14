import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('plan_tasks')
@Index(['planId'])
export class PlanTask extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'date' })
  startDate: string; // ISO date

  @Column({ type: 'date' })
  endDate: string; // ISO date

  @Column({ type: 'varchar', length: 7, nullable: true })
  color?: string;

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => require('../../release-plans/domain/plan.entity').Plan, (plan: any) => plan.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: any;

  constructor(title?: string, startDate?: string, endDate?: string, color?: string) {
    super();
    if (title !== undefined) {
      this.title = title;
    }
    if (startDate !== undefined) {
      this.startDate = startDate;
    }
    if (endDate !== undefined) {
      this.endDate = endDate;
    }
    if (color !== undefined) {
      this.color = color;
    }
    if (title !== undefined && startDate !== undefined && endDate !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Task title is required');
    }
    if (!this.startDate || !this.isValidDate(this.startDate)) {
      throw new Error('Valid start date in YYYY-MM-DD format is required');
    }
    if (!this.endDate || !this.isValidDate(this.endDate)) {
      throw new Error('Valid end date in YYYY-MM-DD format is required');
    }
    if (new Date(this.startDate) > new Date(this.endDate)) {
      throw new Error('Start date must be before or equal to end date');
    }
    if (this.color && !this.isValidColor(this.color)) {
      throw new Error('Invalid color format. Must be a valid hex color');
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

  private isValidColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
}
