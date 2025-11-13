import { BaseEntity } from '../../common/base/base.entity';
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

export class Plan extends BaseEntity {
  name: string;
  owner: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: PlanStatus;
  description?: string;
  phases: PlanPhase[];
  productId?: string;
  itOwner?: string;
  featureIds: string[];
  components: Array<{ componentId: string; finalVersion: string }>;
  calendarIds: string[];
  milestones: PlanMilestone[];
  references: PlanReference[];
  cellData: GanttCellData[];
  tasks: PlanTask[];

  constructor(
    name: string,
    owner: string,
    startDate: string,
    endDate: string,
    status: PlanStatus = PlanStatus.PLANNED,
  ) {
    super();
    this.name = name;
    this.owner = owner;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.phases = [];
    this.featureIds = [];
    this.components = [];
    this.calendarIds = [];
    this.milestones = [];
    this.references = [];
    this.cellData = [];
    this.tasks = [];
    this.validate();
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

  addPhase(phase: PlanPhase): void {
    this.phases.push(phase);
    this.touch();
  }

  removePhase(phaseId: string): void {
    const index = this.phases.findIndex((p) => p.id === phaseId);
    if (index === -1) {
      throw new Error(`Phase with id ${phaseId} not found`);
    }
    this.phases.splice(index, 1);
    this.touch();
  }

  addTask(task: PlanTask): void {
    this.tasks.push(task);
    this.touch();
  }

  removeTask(taskId: string): void {
    const index = this.tasks.findIndex((t) => t.id === taskId);
    if (index === -1) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    this.tasks.splice(index, 1);
    this.touch();
  }
}

