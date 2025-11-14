/**
 * Base Phase Service
 * 
 * Application layer - Business logic
 */
import { Injectable, Inject } from '@nestjs/common';
import { BasePhase } from '../domain/base-phase.entity';
import { CreateBasePhaseDto } from './dto/create-base-phase.dto';
import { UpdateBasePhaseDto } from './dto/update-base-phase.dto';
import { BasePhaseResponseDto } from './dto/base-phase-response.dto';
import type { IBasePhaseRepository } from '../infrastructure/base-phase.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

@Injectable()
export class BasePhaseService {
  constructor(
    @Inject('IBasePhaseRepository')
    private readonly repository: IBasePhaseRepository,
  ) {}

  /**
   * Get all base phases
   */
  async findAll(): Promise<BasePhaseResponseDto[]> {
    const phases = await this.repository.findAll();
    return phases.map((phase) => new BasePhaseResponseDto(phase));
  }

  /**
   * Get base phase by ID
   */
  async findById(id: string): Promise<BasePhaseResponseDto> {
    const phase = await this.repository.findById(id);
    if (!phase) {
      throw new NotFoundException('Base Phase', id);
    }
    return new BasePhaseResponseDto(phase);
  }

  /**
   * Create a new base phase
   * Business rules:
   * - Name must be unique
   * - Color must be unique
   */
  async create(dto: CreateBasePhaseDto): Promise<BasePhaseResponseDto> {
    // Check name uniqueness
    const existingByName = await this.repository.findByName(dto.name);
    if (existingByName) {
      throw new ConflictException(
        `Base phase with name "${dto.name}" already exists`,
        'DUPLICATE_PHASE_NAME',
      );
    }

    // Check color uniqueness
    const existingByColor = await this.repository.findByColor(dto.color);
    if (existingByColor) {
      throw new ConflictException(
        `Base phase with color "${dto.color}" already exists`,
        'DUPLICATE_PHASE_COLOR',
      );
    }

    // Create entity
    const phase = new BasePhase(dto.name, dto.color, dto.category);
    phase.validate(); // Validate before creating

    const created = await this.repository.create(phase);
    return new BasePhaseResponseDto(created);
  }

  /**
   * Update base phase
   * Business rules:
   * - Name must be unique (if changed)
   * - Color must be unique (if changed)
   */
  async update(id: string, dto: UpdateBasePhaseDto): Promise<BasePhaseResponseDto> {
    const phase = await this.repository.findById(id);
    if (!phase) {
      throw new NotFoundException('Base Phase', id);
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== phase.name) {
      const existingByName = await this.repository.findByName(dto.name);
      if (existingByName && existingByName.id !== id) {
        throw new ConflictException(
          `Base phase with name "${dto.name}" already exists`,
          'DUPLICATE_PHASE_NAME',
        );
      }
    }

    // Check color uniqueness if color is being updated
    if (dto.color && dto.color !== phase.color) {
      const existingByColor = await this.repository.findByColor(dto.color);
      if (existingByColor && existingByColor.id !== id) {
        throw new ConflictException(
          `Base phase with color "${dto.color}" already exists`,
          'DUPLICATE_PHASE_COLOR',
        );
      }
    }

    // Update entity
    const updated = await this.repository.update(id, dto);
    updated.validate();

    return new BasePhaseResponseDto(updated);
  }

  /**
   * Delete base phase
   */
  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Base Phase', id);
    }
    await this.repository.delete(id);
  }
}

