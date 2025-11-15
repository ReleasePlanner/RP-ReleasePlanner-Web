import { Feature, FeatureStatus } from '../../domain/feature.entity';
import { FeatureCategory } from '../../../feature-categories/domain/feature-category.entity';
import { Country } from '../../../countries/domain/country.entity';
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

export class CountryResponseDto {
  id: string;
  name: string;
  code: string;
  isoCode?: string;
  region?: string;

  constructor(entity: Country) {
    this.id = entity.id;
    this.name = entity.name;
    this.code = entity.code;
    this.isoCode = entity.isoCode;
    this.region = entity.region;
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
  country?: CountryResponseDto;
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
    this.country = entity.country ? new CountryResponseDto(entity.country) : undefined;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

