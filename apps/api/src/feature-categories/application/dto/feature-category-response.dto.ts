import { ApiProperty } from '@nestjs/swagger';
import { FeatureCategory } from '../../domain/feature-category.entity';

export class FeatureCategoryResponseDto {
  @ApiProperty({ description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  constructor(entity: FeatureCategory) {
    this.id = entity.id;
    this.name = entity.name;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

