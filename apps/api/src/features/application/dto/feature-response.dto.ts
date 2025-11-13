import { Feature, FeatureStatus } from '../../domain/feature.entity';
import { FeatureCategory } from '../../domain/feature-category.entity';
import { ProductOwner } from '../../domain/product-owner.entity';

export class FeatureCategoryResponseDto {
  id: string;
  name: string;

  constructor(entity: FeatureCategory) {
    this.id = entity.id;
    this.name = entity.name;
  }
}

export class ProductOwnerResponseDto {
  id: string;
  name: string;

  constructor(entity: ProductOwner) {
    this.id = entity.id;
    this.name = entity.name;
  }
}

export class FeatureResponseDto {
  id: string;
  name: string;
  description: string;
  category: FeatureCategoryResponseDto;
  status: FeatureStatus;
  createdBy: ProductOwnerResponseDto;
  technicalDescription: string;
  businessDescription: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Feature) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.category = new FeatureCategoryResponseDto(entity.category);
    this.status = entity.status;
    this.createdBy = new ProductOwnerResponseDto(entity.createdBy);
    this.technicalDescription = entity.technicalDescription;
    this.businessDescription = entity.businessDescription;
    this.productId = entity.productId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

