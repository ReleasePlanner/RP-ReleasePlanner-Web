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
import { validateId, validateObject, validateString, validateArray, validateDateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class PlanService {
  constructor(
    @Inject('IPlanRepository')
    private readonly repository: IPlanRepository,
  ) {}

  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!plans) {
      return [];
    }
    return plans
      .filter((plan) => plan !== null && plan !== undefined)
      .map((plan) => new PlanResponseDto(plan));
  }

  async findById(id: string): Promise<PlanResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Plan');
    
    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException('Plan', id);
    }
    return new PlanResponseDto(plan);
  }

  async create(dto: CreatePlanDto): Promise<PlanResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreatePlanDto');
    validateString(dto.name, 'Plan name');
    validateString(dto.owner, 'Plan owner');
    validateDateString(dto.startDate, 'Start date');
    validateDateString(dto.endDate, 'End date');

    // Defensive: Validate date logic
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }

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
      validateId(dto.productId, 'Product');
      plan.productId = dto.productId;
    }
    if (dto.itOwner) {
      validateId(dto.itOwner, 'IT Owner');
      plan.itOwner = dto.itOwner;
    }
    if (dto.featureIds) {
      validateArray(dto.featureIds, 'Feature IDs');
      dto.featureIds.forEach((fid) => validateId(fid, 'Feature'));
      plan.featureIds = dto.featureIds;
    }
    if (dto.calendarIds) {
      validateArray(dto.calendarIds, 'Calendar IDs');
      dto.calendarIds.forEach((cid) => validateId(cid, 'Calendar'));
      plan.calendarIds = dto.calendarIds;
    }

    // Add phases if provided
    if (dto.phases) {
      validateArray(dto.phases, 'Phases');
      dto.phases.forEach((p) => {
        // Defensive: Validate phase data
        if (!p || !p.name) {
          throw new Error('Phase name is required');
        }
        validateString(p.name, 'Phase name');
        if (p.startDate) validateDateString(p.startDate, 'Phase start date');
        if (p.endDate) validateDateString(p.endDate, 'Phase end date');
        const phase = new PlanPhase(p.name, p.startDate, p.endDate, p.color);
        plan.addPhase(phase);
      });
    }

    const created = await this.repository.create(plan);
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create plan');
    }
    
    return new PlanResponseDto(created);
  }

  async update(id: string, dto: UpdatePlanDto): Promise<PlanResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Plan');
    validateObject(dto, 'UpdatePlanDto');

    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException('Plan', id);
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== plan.name) {
      validateString(dto.name, 'Plan name');
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Plan with name "${dto.name}" already exists`,
          'DUPLICATE_PLAN_NAME',
        );
      }
    }

    // Defensive: Validate date logic if dates are being updated
    if (dto.startDate !== undefined && dto.endDate !== undefined) {
      validateDateString(dto.startDate, 'Start date');
      validateDateString(dto.endDate, 'End date');
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);
      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }
    } else if (dto.startDate !== undefined) {
      validateDateString(dto.startDate, 'Start date');
      const startDate = new Date(dto.startDate);
      const endDate = new Date(plan.endDate);
      if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
      }
    } else if (dto.endDate !== undefined) {
      validateDateString(dto.endDate, 'End date');
      const startDate = new Date(plan.startDate);
      const endDate = new Date(dto.endDate);
      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }
    }

    // Update basic fields
    if (dto.name !== undefined) {
      validateString(dto.name, 'Plan name');
      plan.name = dto.name;
    }
    if (dto.owner !== undefined) {
      validateString(dto.owner, 'Plan owner');
      plan.owner = dto.owner;
    }
    if (dto.startDate !== undefined) {
      plan.startDate = dto.startDate;
    }
    if (dto.endDate !== undefined) {
      plan.endDate = dto.endDate;
    }
    if (dto.status !== undefined) {
      plan.status = dto.status;
    }
    if (dto.description !== undefined) {
      plan.description = dto.description;
    }
    if (dto.productId !== undefined) {
      validateId(dto.productId, 'Product');
      plan.productId = dto.productId;
    }
    if (dto.itOwner !== undefined) {
      validateId(dto.itOwner, 'IT Owner');
      plan.itOwner = dto.itOwner;
    }
    if (dto.featureIds !== undefined) {
      validateArray(dto.featureIds, 'Feature IDs');
      dto.featureIds.forEach((fid) => validateId(fid, 'Feature'));
      plan.featureIds = dto.featureIds;
    }
    if (dto.calendarIds !== undefined) {
      validateArray(dto.calendarIds, 'Calendar IDs');
      dto.calendarIds.forEach((cid) => validateId(cid, 'Calendar'));
      plan.calendarIds = dto.calendarIds;
    }
    if (dto.components !== undefined) {
      validateArray(dto.components, 'Components');
      dto.components.forEach((comp) => {
        if (!comp || !comp.componentId || !comp.finalVersion) {
          throw new Error('Invalid component data');
        }
        validateId(comp.componentId, 'Component');
        validateString(comp.finalVersion, 'Final version');
      });
      plan.components = dto.components;
    }

    // Update phases if provided (replace all phases)
    if (dto.phases !== undefined) {
      validateArray(dto.phases, 'Phases');
      plan.phases = [];
      dto.phases.forEach((p) => {
        // Defensive: Validate phase data
        if (!p || !p.name) {
          throw new Error('Phase name is required');
        }
        validateString(p.name, 'Phase name');
        if (p.startDate) validateDateString(p.startDate, 'Phase start date');
        if (p.endDate) validateDateString(p.endDate, 'Phase end date');
        const phase = new PlanPhase(p.name, p.startDate, p.endDate, p.color);
        plan.addPhase(phase);
      });
    }

    // Update tasks if provided (replace all tasks)
    if (dto.tasks !== undefined) {
      validateArray(dto.tasks, 'Tasks');
      plan.tasks = [];
      dto.tasks.forEach((t) => {
        // Defensive: Validate task data
        if (!t || !t.title || !t.startDate || !t.endDate) {
          throw new Error('Task title, start date, and end date are required');
        }
        validateString(t.title, 'Task title');
        validateDateString(t.startDate, 'Task start date');
        validateDateString(t.endDate, 'Task end date');
        const taskStart = new Date(t.startDate);
        const taskEnd = new Date(t.endDate);
        if (taskStart >= taskEnd) {
          throw new Error('Task end date must be after start date');
        }
        const task = new PlanTask(t.title, t.startDate, t.endDate, t.color);
        plan.addTask(task);
      });
    }

    // Update milestones if provided (replace all milestones)
    if (dto.milestones !== undefined) {
      validateArray(dto.milestones, 'Milestones');
      plan.milestones = [];
      dto.milestones.forEach((m) => {
        // Defensive: Validate milestone data
        if (!m || !m.date || !m.name) {
          throw new Error('Milestone date and name are required');
        }
        validateDateString(m.date, 'Milestone date');
        validateString(m.name, 'Milestone name');
        const milestone = new PlanMilestone(m.date, m.name, m.description);
        milestone.planId = plan.id;
        if (!plan.milestones) plan.milestones = [];
        plan.milestones.push(milestone);
      });
    }

    // Update references if provided (replace all references)
    if (dto.references !== undefined) {
      validateArray(dto.references, 'References');
      plan.references = [];
      dto.references.forEach((r) => {
        // Defensive: Validate reference data
        if (!r || !r.type || !r.title) {
          throw new Error('Reference type and title are required');
        }
        validateString(r.type, 'Reference type');
        validateString(r.title, 'Reference title');
        if (r.date) validateDateString(r.date, 'Reference date');
        if (r.phaseId) validateId(r.phaseId, 'Phase');
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
      validateArray(dto.cellData, 'Cell data');
      plan.cellData = [];
      dto.cellData.forEach((c) => {
        // Defensive: Validate cell data
        if (!c || !c.date) {
          throw new Error('Cell data date is required');
        }
        validateDateString(c.date, 'Cell date');
        if (c.phaseId) validateId(c.phaseId, 'Phase');
        
        const cellData = new GanttCellData(
          c.date,
          c.phaseId,
          c.isMilestone,
          c.milestoneColor,
        );
        cellData.planId = plan.id;

        // Add comments if provided
        if (c.comments) {
          validateArray(c.comments, 'Comments');
          cellData.comments = [];
          c.comments.forEach((cm) => {
            // Defensive: Validate comment data
            if (!cm || !cm.text || !cm.author) {
              throw new Error('Comment text and author are required');
            }
            validateString(cm.text, 'Comment text');
            validateString(cm.author, 'Comment author');
            const comment = new GanttCellComment(cm.text, cm.author);
            comment.cellDataId = cellData.id;
            if (!cellData.comments) cellData.comments = [];
            cellData.comments.push(comment);
          });
        }

        // Add files if provided
        if (c.files) {
          validateArray(c.files, 'Files');
          cellData.files = [];
          c.files.forEach((f) => {
            // Defensive: Validate file data
            if (!f || !f.name || !f.url) {
              throw new Error('File name and URL are required');
            }
            validateString(f.name, 'File name');
            validateString(f.url, 'File URL');
            if (f.size !== undefined && (typeof f.size !== 'number' || f.size < 0)) {
              throw new Error('File size must be a non-negative number');
            }
            const file = new GanttCellFile(f.name, f.url, f.size, f.mimeType);
            file.cellDataId = cellData.id;
            if (!cellData.files) cellData.files = [];
            cellData.files.push(file);
          });
        }

        // Add links if provided
        if (c.links) {
          validateArray(c.links, 'Links');
          cellData.links = [];
          c.links.forEach((l) => {
            // Defensive: Validate link data
            if (!l || !l.title || !l.url) {
              throw new Error('Link title and URL are required');
            }
            validateString(l.title, 'Link title');
            validateString(l.url, 'Link URL');
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
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update plan');
    }
    
    return new PlanResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Plan');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Plan', id);
    }
    await this.repository.delete(id);
  }
}

