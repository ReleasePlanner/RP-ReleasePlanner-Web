import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureDto } from './create-feature.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { FeatureStatus } from '../../domain/feature.entity';

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {
  @IsEnum(FeatureStatus)
  @IsOptional()
  override status?: FeatureStatus;
}

