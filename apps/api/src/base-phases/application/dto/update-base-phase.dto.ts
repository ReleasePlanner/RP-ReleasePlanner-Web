/**
 * Update Base Phase DTO
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateBasePhaseDto } from './create-base-phase.dto';
import { IsString, Matches, IsOptional } from 'class-validator';

export class UpdateBasePhaseDto extends PartialType(CreateBasePhaseDto) {
  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid hex color (e.g., #FF5733)',
  })
  override color?: string;
}

