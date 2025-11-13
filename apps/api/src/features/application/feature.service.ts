import { Injectable, Inject } from '@nestjs/common';
import { Feature } from '../domain/feature.entity';
import { FeatureCategory } from '../domain/feature-category.entity';
import { ProductOwner } from '../domain/product-owner.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureResponseDto } from './dto/feature-response.dto';
import { IFeatureRepository } from '../infrastructure/feature.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

@Injectable()
export class FeatureService {
  constructor(
    @Inject('IFeatureRepository')
    private readonly repository: IFeatureRepository,
  ) {}

  async findAll(): Promise<FeatureResponseDto[]> {
    const features = await this.repository.findAll();
    return features.map((feature) => new FeatureResponseDto(feature));
  }

  async findById(id: string): Promise<FeatureResponseDto> {
    const feature = await this.repository.findById(id);
    if (!feature) {
      throw new NotFoundException('Feature', id);
    }
    return new FeatureResponseDto(feature);
  }

  async findByProductId(productId: string): Promise<FeatureResponseDto[]> {
    const features = await this.repository.findByProductId(productId);
    return features.map((feature) => new FeatureResponseDto(feature));
  }

  async create(dto: CreateFeatureDto): Promise<FeatureResponseDto> {
    // Check name uniqueness
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Feature with name "${dto.name}" already exists`,
        'DUPLICATE_FEATURE_NAME',
      );
    }

    // Create nested entities
    const category = new FeatureCategory(dto.category.name);
    const productOwner = new ProductOwner(dto.createdBy.name);

    // Create feature
    const feature = new Feature(
      dto.name,
      dto.description,
      category,
      dto.status,
      productOwner,
      dto.technicalDescription,
      dto.businessDescription,
      dto.productId,
    );

    const created = await this.repository.create(feature);
    return new FeatureResponseDto(created);
  }

  async update(id: string, dto: UpdateFeatureDto): Promise<FeatureResponseDto> {
    const feature = await this.repository.findById(id);
    if (!feature) {
      throw new NotFoundException('Feature', id);
    }

    // Update nested entities if provided
    if (dto.category) {
      feature.category = new FeatureCategory(dto.category.name);
    }
    if (dto.createdBy) {
      feature.createdBy = new ProductOwner(dto.createdBy.name);
    }

    const updated = await this.repository.update(id, dto);
    return new FeatureResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Feature', id);
    }
    await this.repository.delete(id);
  }
}

