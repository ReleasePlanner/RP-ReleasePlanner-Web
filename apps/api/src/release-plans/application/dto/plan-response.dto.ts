import { Plan, PlanStatus } from '../../domain/plan.entity';
import { PlanPhase } from '../../domain/plan-phase.entity';
import { PlanTask } from '../../domain/plan-task.entity';
import { PlanMilestone } from '../../domain/plan-milestone.entity';
import { PlanReference } from '../../domain/plan-reference.entity';
import { GanttCellData } from '../../domain/gantt-cell-data.entity';

export class PlanPhaseResponseDto {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanPhase) {
    this.id = entity.id;
    this.name = entity.name;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.color = entity.color;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class PlanTaskResponseDto {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanTask) {
    this.id = entity.id;
    this.title = entity.title;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.color = entity.color;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class PlanMilestoneResponseDto {
  id: string;
  date: string;
  name: string;
  description?: string;
  phaseId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanMilestone) {
    this.id = entity.id;
    this.date = entity.date;
    this.name = entity.name;
    this.description = entity.description;
    this.phaseId = entity.phaseId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class PlanReferenceResponseDto {
  id: string;
  type: string;
  title: string;
  url?: string;
  description?: string;
  date?: string;
  phaseId?: string;
  milestoneColor?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: PlanReference) {
    this.id = entity.id;
    this.type = entity.type;
    this.title = entity.title;
    this.url = entity.url;
    this.description = entity.description;
    this.date = entity.date;
    this.phaseId = entity.phaseId;
    this.milestoneColor = entity.milestoneColor;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class GanttCellDataResponseDto {
  id: string;
  phaseId?: string;
  date: string;
  isMilestone?: boolean;
  milestoneColor?: string;
  comments: Array<{ id: string; text: string; author: string; createdAt: Date; updatedAt?: Date }>;
  files: Array<{ id: string; name: string; url: string; size?: number; mimeType?: string; uploadedAt: Date }>;
  links: Array<{ id: string; title: string; url: string; description?: string; createdAt: Date }>;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: GanttCellData) {
    this.id = entity.id;
    this.phaseId = entity.phaseId;
    this.date = entity.date;
    this.isMilestone = entity.isMilestone;
    this.milestoneColor = entity.milestoneColor;
    this.comments = entity.comments;
    this.files = entity.files?.map((file: any) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      size: file.size,
      mimeType: file.mimeType,
      uploadedAt: file.createdAt || file.uploadedAt || new Date(),
    })) || [];
    this.links = entity.links;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class PlanResponseDto {
  id: string;
  name: string;
  owner: string; // Owner name from it_owners table (via JOIN)
  startDate: string;
  endDate: string;
  status: PlanStatus;
  description?: string;
  phases: PlanPhaseResponseDto[];
  productId?: string;
  itOwner?: string;
  featureIds: string[];
  components: Array<{ componentId: string; currentVersion: string; finalVersion: string }>;
  calendarIds: string[];
  milestones: PlanMilestoneResponseDto[];
  references: PlanReferenceResponseDto[];
  cellData: GanttCellDataResponseDto[];
  tasks: PlanTaskResponseDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Plan & { ownerName?: string }) {
    this.id = entity.id;
    this.name = entity.name;
    // Use ownerName from JOIN with it_owners table, fallback to empty string if not available
    this.owner = (entity as any).ownerName || '';
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.status = entity.status;
    this.description = entity.description;
    // Defensive: Handle undefined/null relations
    this.phases = (entity.phases && Array.isArray(entity.phases)) 
      ? entity.phases.map((p) => new PlanPhaseResponseDto(p))
      : [];
    this.productId = entity.productId;
    this.itOwner = entity.itOwner;
    this.featureIds = entity.featureIds || [];
    this.components = entity.components || [];
    this.calendarIds = entity.calendarIds || [];
    this.milestones = (entity.milestones && Array.isArray(entity.milestones))
      ? entity.milestones.map((m) => new PlanMilestoneResponseDto(m))
      : [];
    this.references = (entity.references && Array.isArray(entity.references))
      ? entity.references.map((r) => new PlanReferenceResponseDto(r))
      : [];
    this.cellData = (entity.cellData && Array.isArray(entity.cellData))
      ? entity.cellData.map((c) => new GanttCellDataResponseDto(c))
      : [];
    this.tasks = (entity.tasks && Array.isArray(entity.tasks))
      ? entity.tasks.map((t) => new PlanTaskResponseDto(t))
      : [];
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

