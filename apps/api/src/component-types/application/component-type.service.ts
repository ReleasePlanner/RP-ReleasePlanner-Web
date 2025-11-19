import { Injectable, Inject } from '@nestjs/common';
import { ProductComponent } from '../domain/component-type.entity';
import { CreateComponentTypeDto } from './dto/create-component-type.dto';
import { UpdateComponentTypeDto } from './dto/update-component-type.dto';
import { ComponentTypeResponseDto } from './dto/component-type-response.dto';
import type { IComponentTypeRepository } from '../infrastructure/component-type.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class ComponentTypeService {
  constructor(
    @Inject('IComponentTypeRepository')
    private readonly repository: IComponentTypeRepository,
  ) {}

  async findAll(): Promise<ComponentTypeResponseDto[]> {
    const types = await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!types) {
      return [];
    }
    return types
      .filter((type) => type !== null && type !== undefined)
      .map((type) => new ComponentTypeResponseDto(type));
  }

  async findById(id: string): Promise<ComponentTypeResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Component Type');
    
    const type = await this.repository.findById(id);
    if (!type) {
      throw new NotFoundException('Component Type', id);
    }
    return new ComponentTypeResponseDto(type);
  }

  async create(dto: CreateComponentTypeDto): Promise<ComponentTypeResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreateComponentTypeDto');
    validateString(dto.name, 'Component type name');

    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Component type with name "${dto.name}" already exists`,
        'DUPLICATE_COMPONENT_TYPE_NAME',
      );
    }

    if (dto.code) {
      const existingByCode = await this.repository.findByCode(dto.code);
      if (existingByCode) {
        throw new ConflictException(
          `Component type with code "${dto.code}" already exists`,
          'DUPLICATE_COMPONENT_TYPE_CODE',
        );
      }
    }

    const componentType = new ProductComponent(dto.name, dto.code, dto.description);
    const created = await this.repository.create(componentType);
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create Component Type');
    }
    
    return new ComponentTypeResponseDto(created);
  }

  async update(id: string, dto: UpdateComponentTypeDto): Promise<ComponentTypeResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Component Type');
    validateObject(dto, 'UpdateComponentTypeDto');

    const componentType = await this.repository.findById(id);
    if (!componentType) {
      throw new NotFoundException('Component Type', id);
    }

    if (dto.name && dto.name !== componentType.name) {
      validateString(dto.name, 'Component type name');
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Component type with name "${dto.name}" already exists`,
          'DUPLICATE_COMPONENT_TYPE_NAME',
        );
      }
    }

    if (dto.code && dto.code !== componentType.code) {
      const existingByCode = await this.repository.findByCode(dto.code);
      if (existingByCode && existingByCode.id !== id) {
        throw new ConflictException(
          `Component type with code "${dto.code}" already exists`,
          'DUPLICATE_COMPONENT_TYPE_CODE',
        );
      }
    }

    const updated = await this.repository.update(id, dto);
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update Component Type');
    }
    
    return new ComponentTypeResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Component Type');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Component Type', id);
    }
    await this.repository.delete(id);
  }
}

