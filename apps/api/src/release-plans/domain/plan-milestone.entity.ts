import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

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

  @ManyToOne(() => require('../../release-plans/domain/plan.entity').Plan, (plan: any) => plan.milestones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: any;

  constructor(date?: string, name?: string, description?: string) {
    super();
    if (date !== undefined) {
      this.date = date;
    }
    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (date !== undefined && name !== undefined) {
      this.validate();
    }
  }

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
