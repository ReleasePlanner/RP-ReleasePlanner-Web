import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { Plan } from './plan.entity';

@Entity('plan_milestones')
@Index(['planId'])
export class PlanMilestone extends BaseEntity {
  @Column({ type: 'date' })
  date: string; // ISO date (YYYY-MM-DD)

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => Plan, (plan) => plan.milestones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  validate(): void {
    if (!this.date || !this.isValidDate(this.date)) {
      throw new Error('Valid date in YYYY-MM-DD format is required');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Milestone name is required');
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
