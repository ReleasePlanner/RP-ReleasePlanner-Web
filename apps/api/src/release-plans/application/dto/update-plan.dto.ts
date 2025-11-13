import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PlanStatus } from '../../domain/plan.entity';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @IsEnum(PlanStatus)
  @IsOptional()
  status?: PlanStatus;
}

