import { Injectable, Inject } from '@nestjs/common';
import { FeatureCategory } from '../domain/feature-category.entity';
import { CreateFeatureCategoryDto } from './dto/create-feature-category.dto';
import { UpdateFeatureCategoryDto } from './dto/update-feature-category.dto';
import { FeatureCategoryResponseDto } from './dto/feature-category-response.dto';
import type { IFeatureCategoryRepository } from '../infrastructure/feature-category.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class FeatureCategoryService {
  constructor(
    @Inject('IFeatureCategoryRepository')
    private readonly repository: IFeatureCategoryRepository,
  ) {}

  async findAll(): Promise<FeatureCategoryResponseDto[]> {
    const categories = await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!categories) {
      return [];
    }
    return categories
      .filter((category) => category !== null && category !== undefined)
      .map((category) => new FeatureCategoryResponseDto(category));
  }

  async findById(id: string): Promise<FeatureCategoryResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Feature Category');
    
    const category = await this.repository.findById(id);
    if (!category) {
      throw new NotFoundException('Feature Category', id);
    }
    return new FeatureCategoryResponseDto(category);
  }

  async create(dto: CreateFeatureCategoryDto): Promise<FeatureCategoryResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreateFeatureCategoryDto');
    validateString(dto.name, 'Feature category name');

    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Feature category with name "${dto.name}" already exists`,
        'DUPLICATE_FEATURE_CATEGORY_NAME',
      );
    }

    const category = new FeatureCategory(dto.name);
    const created = await this.repository.create(category);
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create Feature Category');
    }
    
    return new FeatureCategoryResponseDto(created);
  }

  async update(id: string, dto: UpdateFeatureCategoryDto): Promise<FeatureCategoryResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Feature Category');
    validateObject(dto, 'UpdateFeatureCategoryDto');

    const category = await this.repository.findById(id);
    if (!category) {
      throw new NotFoundException('Feature Category', id);
    }

    if (dto.name && dto.name !== category.name) {
      validateString(dto.name, 'Feature category name');
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Feature category with name "${dto.name}" already exists`,
          'DUPLICATE_FEATURE_CATEGORY_NAME',
        );
      }
    }

    const updated = await this.repository.update(id, dto);
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update Feature Category');
    }
    
    return new FeatureCategoryResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Feature Category');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Feature Category', id);
    }
    await this.repository.delete(id);
  }
}

