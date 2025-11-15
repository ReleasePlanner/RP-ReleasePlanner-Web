/**
 * Update Base Phase DTO
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateBasePhaseDto } from './create-base-phase.dto';
import { IsString, Matches, IsOptional } from 'class-validator';
import { BASE_PHASE_VALIDATION_MESSAGES } from '../../constants';
import { VALIDATION_RULES } from '../../../common/constants';

export class UpdateBasePhaseDto extends PartialType(CreateBasePhaseDto) {
  @IsString()
  @IsOptional()
  @Matches(VALIDATION_RULES.COLOR.PATTERN, {
    message: BASE_PHASE_VALIDATION_MESSAGES.PHASE_COLOR_INVALID,
  })
  override color?: string;
}

