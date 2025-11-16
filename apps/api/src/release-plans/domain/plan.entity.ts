import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { PlanPhase } from './plan-phase.entity';
import { PlanTask } from './plan-task.entity';
import { PlanMilestone } from './plan-milestone.entity';
import { PlanReference } from './plan-reference.entity';
import { GanttCellData } from './gantt-cell-data.entity';

export enum PlanStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  PAUSED = 'paused',
}

@Entity('plans')
@Index(['name'])
@Index(['productId'])
@Index(['itOwner'])
export class Plan extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  owner: string;

  @Column({ type: 'date' })
  startDate: string; // ISO date

  @Column({ type: 'date' })
  endDate: string; // ISO date

  @Column({ type: 'enum', enum: PlanStatus, default: PlanStatus.PLANNED })
  status: PlanStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  productId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  itOwner?: string;

  // Arrays stored as JSON columns
  @Column({ type: 'jsonb', default: '[]' })
  featureIds: string[];

  @Column({ type: 'jsonb', default: '[]' })
  components: Array<{ componentId: string; finalVersion: string }>;

  @Column({ type: 'jsonb', default: '[]' })
  calendarIds: string[];

  // Relations
  @OneToMany(() => PlanPhase, (phase) => phase.plan, {
    cascade: true,
    eager: false,
  })
  phases?: PlanPhase[];

  @OneToMany(() => PlanTask, (task) => task.plan, {
    cascade: true,
    eager: false,
  })
  tasks?: PlanTask[];

  @OneToMany(() => PlanMilestone, (milestone) => milestone.plan, {
    cascade: true,
    eager: false,
  })
  milestones?: PlanMilestone[];

  @OneToMany(() => PlanReference, (reference) => reference.plan, {
    cascade: true,
    eager: false,
  })
  references?: PlanReference[];

  @OneToMany(() => GanttCellData, (cellData) => cellData.plan, {
    cascade: true,
    eager: false,
  })
  cellData?: GanttCellData[];

  constructor(
    name?: string,
    owner?: string,
    startDate?: string,
    endDate?: string,
    status?: PlanStatus,
    description?: string,
  ) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (owner !== undefined) {
      this.owner = owner;
    }
    if (startDate !== undefined) {
      this.startDate = startDate;
    }
    if (endDate !== undefined) {
      this.endDate = endDate;
    }
    if (status !== undefined) {
      this.status = status;
    } else {
      this.status = PlanStatus.PLANNED;
    }
    if (description !== undefined) {
      this.description = description;
    }
    // Don't initialize TypeORM relations - TypeORM will handle them
    // Only initialize JSON column arrays (not relations)
    this.featureIds = [];
    this.components = [];
    this.calendarIds = [];
    if (name !== undefined && owner !== undefined && startDate !== undefined && endDate !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Plan name is required');
    }
    if (!this.owner || this.owner.trim().length === 0) {
      throw new Error('Plan owner is required');
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
    if (!Object.values(PlanStatus).includes(this.status)) {
      throw new Error(`Invalid plan status: ${this.status}`);
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

  addPhase(phase: any): void {
    if (!this.phases) {
      this.phases = [];
    }
    phase.planId = this.id;
    this.phases.push(phase);
    this.touch();
  }

  removePhase(phaseId: string): void {
    if (!this.phases) {
      throw new Error('No phases available');
    }
    const index = this.phases.findIndex((p) => p.id === phaseId);
    if (index === -1) {
      throw new Error(`Phase with id ${phaseId} not found`);
    }
    this.phases.splice(index, 1);
    this.touch();
  }

  addTask(task: PlanTask): void {
    if (!this.tasks) {
      this.tasks = [];
    }
    task.planId = this.id;
    this.tasks.push(task);
    this.touch();
  }

  removeTask(taskId: string): void {
    if (!this.tasks) {
      throw new Error('No tasks available');
    }
    const index = this.tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    this.tasks.splice(index, 1);
    this.touch();
  }
}
