import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FeatureStatus } from '../../domain/feature.entity';

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
  @IsNotEmpty({ message: 'Feature name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Feature description is required' })
  description: string;

  @ValidateNested()
  @Type(() => CreateFeatureCategoryDto)
  category: CreateFeatureCategoryDto;

  @IsEnum(FeatureStatus)
  status: FeatureStatus;

  @ValidateNested()
  @Type(() => CreateProductOwnerDto)
  createdBy: CreateProductOwnerDto;

  @IsString()
  @IsNotEmpty({ message: 'Technical description is required' })
  technicalDescription: string;

  @IsString()
  @IsNotEmpty({ message: 'Business description is required' })
  businessDescription: string;

  @IsString()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;
}

