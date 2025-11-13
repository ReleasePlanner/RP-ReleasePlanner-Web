import { Injectable, Inject } from '@nestjs/common';
import { Plan, PlanStatus } from '../domain/plan.entity';
import { PlanPhase } from '../domain/plan-phase.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { IPlanRepository } from '../infrastructure/plan.repository';
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

    const updated = await this.repository.update(id, dto);
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

