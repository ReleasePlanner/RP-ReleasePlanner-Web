import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureDto } from './create-feature.dto';
import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { FeatureStatus } from '../../domain/feature.entity';

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {
  @IsEnum(FeatureStatus)
  @IsOptional()
  override status?: FeatureStatus;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsUUID()
  @IsOptional()
  countryId?: string;

  @IsDateString()
  @IsOptional()
  updatedAt?: string; // For optimistic locking
}

