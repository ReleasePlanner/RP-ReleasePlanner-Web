import { Injectable, Inject } from '@nestjs/common';
import { Plan, PlanStatus } from '../domain/plan.entity';
import { PlanPhase } from '../domain/plan-phase.entity';
import { PlanTask } from '../domain/plan-task.entity';
import { PlanMilestone } from '../domain/plan-milestone.entity';
import { PlanReference, PlanReferenceType } from '../domain/plan-reference.entity';
import { GanttCellData } from '../domain/gantt-cell-data.entity';
import { GanttCellComment } from '../domain/gantt-cell-data.entity';
import { GanttCellFile } from '../domain/gantt-cell-data.entity';
import { GanttCellLink } from '../domain/gantt-cell-data.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import type { IPlanRepository } from '../infrastructure/plan.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

@Injectable()
export class PlanService {
  constructor(
    @Inject('IPlanRepository')
    private readonly repository: IPlanRepository,
  ) {}

  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.repository.findAll();
    return plans.map((plan) => new PlanResponseDto(plan));
  }

  async findById(id: string): Promise<PlanResponseDto> {
    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException('Plan', id);
    }
    return new PlanResponseDto(plan);
  }

  async create(dto: CreatePlanDto): Promise<PlanResponseDto> {
    // Check name uniqueness
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Plan with name "${dto.name}" already exists`,
        'DUPLICATE_PLAN_NAME',
      );
    }

    // Create plan
    const plan = new Plan(
      dto.name,
      dto.owner,
      dto.startDate,
      dto.endDate,
      dto.status || PlanStatus.PLANNED,
    );

    if (dto.description) {
      plan.description = dto.description;
    }
    if (dto.productId) {
      plan.productId = dto.productId;
    }
    if (dto.itOwner) {
      plan.itOwner = dto.itOwner;
    }
    if (dto.featureIds) {
      plan.featureIds = dto.featureIds;
    }
    if (dto.calendarIds) {
      plan.calendarIds = dto.calendarIds;
    }

    // Add phases if provided
    if (dto.phases) {
      dto.phases.forEach((p) => {
        const phase = new PlanPhase(p.name, p.startDate, p.endDate, p.color);
        plan.addPhase(phase);
      });
    }

    const created = await this.repository.create(plan);
    return new PlanResponseDto(created);
  }

  async update(id: string, dto: UpdatePlanDto): Promise<PlanResponseDto> {
    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException('Plan', id);
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== plan.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Plan with name "${dto.name}" already exists`,
          'DUPLICATE_PLAN_NAME',
        );
      }
    }

    // Update basic fields
    if (dto.name !== undefined) plan.name = dto.name;
    if (dto.owner !== undefined) plan.owner = dto.owner;
    if (dto.startDate !== undefined) plan.startDate = dto.startDate;
    if (dto.endDate !== undefined) plan.endDate = dto.endDate;
    if (dto.status !== undefined) plan.status = dto.status;
    if (dto.description !== undefined) plan.description = dto.description;
    if (dto.productId !== undefined) plan.productId = dto.productId;
    if (dto.itOwner !== undefined) plan.itOwner = dto.itOwner;
    if (dto.featureIds !== undefined) plan.featureIds = dto.featureIds;
    if (dto.calendarIds !== undefined) plan.calendarIds = dto.calendarIds;
    if (dto.components !== undefined) plan.components = dto.components;

    // Update phases if provided (replace all phases)
    if (dto.phases !== undefined) {
      plan.phases = [];
      dto.phases.forEach((p) => {
        const phase = new PlanPhase(p.name, p.startDate, p.endDate, p.color);
        plan.addPhase(phase);
      });
    }

    // Update tasks if provided (replace all tasks)
    if (dto.tasks !== undefined) {
      plan.tasks = [];
      dto.tasks.forEach((t) => {
        const task = new PlanTask(t.title, t.startDate, t.endDate, t.color);
        plan.addTask(task);
      });
    }

    // Update milestones if provided (replace all milestones)
    if (dto.milestones !== undefined) {
      plan.milestones = [];
      dto.milestones.forEach((m) => {
        const milestone = new PlanMilestone(m.date, m.name, m.description);
        milestone.planId = plan.id;
        if (!plan.milestones) plan.milestones = [];
        plan.milestones.push(milestone);
      });
    }

    // Update references if provided (replace all references)
    if (dto.references !== undefined) {
      plan.references = [];
      dto.references.forEach((r) => {
        const reference = new PlanReference(
          r.type as PlanReferenceType,
          r.title,
          r.url,
          r.description,
          r.date,
          r.phaseId,
        );
        reference.planId = plan.id;
        if (!plan.references) plan.references = [];
        plan.references.push(reference);
      });
    }

    // Update cellData if provided (replace all cellData)
    if (dto.cellData !== undefined) {
      plan.cellData = [];
      dto.cellData.forEach((c) => {
        const cellData = new GanttCellData(
          c.date,
          c.phaseId,
          c.isMilestone,
          c.milestoneColor,
        );
        cellData.planId = plan.id;

        // Add comments if provided
        if (c.comments) {
          cellData.comments = [];
          c.comments.forEach((cm) => {
            const comment = new GanttCellComment(cm.text, cm.author);
            comment.cellDataId = cellData.id;
            if (!cellData.comments) cellData.comments = [];
            cellData.comments.push(comment);
          });
        }

        // Add files if provided
        if (c.files) {
          cellData.files = [];
          c.files.forEach((f) => {
            const file = new GanttCellFile(f.name, f.url, f.size, f.mimeType);
            file.cellDataId = cellData.id;
            if (!cellData.files) cellData.files = [];
            cellData.files.push(file);
          });
        }

        // Add links if provided
        if (c.links) {
          cellData.links = [];
          c.links.forEach((l) => {
            const link = new GanttCellLink(l.title, l.url, l.description);
            link.cellDataId = cellData.id;
            if (!cellData.links) cellData.links = [];
            cellData.links.push(link);
          });
        }

        if (!plan.cellData) plan.cellData = [];
        plan.cellData.push(cellData);
      });
    }

    // Validate plan before saving
    plan.validate();

    const updated = await this.repository.save(plan);
    return new PlanResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Plan', id);
    }
    await this.repository.delete(id);
  }
}

