import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FeatureStatus } from '../../domain/feature.entity';
import { FEATURE_VALIDATION_MESSAGES } from '../../constants';

// Declarar las clases DTO anidadas primero para evitar problemas de inicialización
export class CreateFeatureCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateProductOwnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty({ message: FEATURE_VALIDATION_MESSAGES.FEATURE_NAME_REQUIRED })
  name: string;

  @IsString()
  @IsNotEmpty({ message: FEATURE_VALIDATION_MESSAGES.FEATURE_DESCRIPTION_REQUIRED })
  description: string;

  // Support both categoryId (preferred) and category object (for backward compatibility)
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ValidateNested()
  @Type(() => CreateFeatureCategoryDto)
  @IsOptional()
  category?: CreateFeatureCategoryDto;

  @IsEnum(FeatureStatus)
  status: FeatureStatus;

  @ValidateNested()
  @Type(() => CreateProductOwnerDto)
  createdBy: CreateProductOwnerDto;

  @IsString()
  @IsNotEmpty({ message: FEATURE_VALIDATION_MESSAGES.FEATURE_TECHNICAL_DESCRIPTION_REQUIRED })
  technicalDescription: string;

  @IsString()
  @IsNotEmpty({ message: FEATURE_VALIDATION_MESSAGES.FEATURE_BUSINESS_DESCRIPTION_REQUIRED })
  businessDescription: string;

  @IsString()
  @IsNotEmpty({ message: FEATURE_VALIDATION_MESSAGES.FEATURE_PRODUCT_ID_REQUIRED })
  productId: string;

  @IsUUID()
  @IsOptional()
  countryId?: string;
}

