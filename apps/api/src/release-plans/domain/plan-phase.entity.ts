import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { Plan } from './plan.entity';

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

  @ManyToOne(() => Plan, (plan) => plan.phases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: Plan;

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
