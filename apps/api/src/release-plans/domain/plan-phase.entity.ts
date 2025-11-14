import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('plan_phases')
@Index(['planId'])
export class PlanPhase extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date', nullable: true })
  startDate?: string; // ISO date (YYYY-MM-DD)

  @Column({ type: 'date', nullable: true })
  endDate?: string; // ISO date (YYYY-MM-DD)

  @Column({ type: 'varchar', length: 7, nullable: true })
  color?: string;

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => require('../../release-plans/domain/plan.entity').Plan, (plan: any) => plan.phases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: any;

  constructor(name?: string, startDate?: string, endDate?: string, color?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
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
    if (name !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Phase name is required');
    }
    if (this.startDate && this.endDate) {
      if (new Date(this.startDate) > new Date(this.endDate)) {
        throw new Error('Start date must be before or equal to end date');
      }
    }
    if (this.color && !this.isValidColor(this.color)) {
      throw new Error('Invalid color format. Must be a valid hex color');
    }
  }

  private isValidColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
}
