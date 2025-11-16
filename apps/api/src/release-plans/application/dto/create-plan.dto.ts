import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PlanStatus } from '../../domain/plan.entity';
import { PLAN_VALIDATION_MESSAGES, PLAN_API_PROPERTY_DESCRIPTIONS, PLAN_API_PROPERTY_EXAMPLES } from '../../constants';

// Declarar las clases DTO anidadas primero para evitar problemas de inicialización
export class CreatePlanPhaseDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASE_NAME,
    example: PLAN_API_PROPERTY_EXAMPLES.PHASE_NAME,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASE_START_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.PHASE_START_DATE,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASE_END_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.PHASE_END_DATE,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASE_COLOR,
    example: PLAN_API_PROPERTY_EXAMPLES.PHASE_COLOR,
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
}

export class CreatePlanTaskDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.TASK_TITLE,
    example: PLAN_API_PROPERTY_EXAMPLES.TASK_TITLE,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.TASK_START_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.TASK_START_DATE,
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.TASK_END_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.TASK_END_DATE,
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.TASK_COLOR,
    example: PLAN_API_PROPERTY_EXAMPLES.TASK_COLOR,
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
}

export class CreatePlanDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.NAME,
    example: PLAN_API_PROPERTY_EXAMPLES.NAME,
  })
  @IsString()
  @IsNotEmpty({ message: PLAN_VALIDATION_MESSAGES.PLAN_NAME_REQUIRED })
  name: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.OWNER,
    example: PLAN_API_PROPERTY_EXAMPLES.OWNER,
  })
  @IsString()
  @IsNotEmpty({ message: PLAN_VALIDATION_MESSAGES.PLAN_OWNER_REQUIRED })
  owner: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.START_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.START_DATE,
  })
  @IsDateString()
  @IsNotEmpty({ message: PLAN_VALIDATION_MESSAGES.PLAN_START_DATE_REQUIRED })
  startDate: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.END_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.END_DATE,
  })
  @IsDateString()
  @IsNotEmpty({ message: PLAN_VALIDATION_MESSAGES.PLAN_END_DATE_REQUIRED })
  endDate: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.STATUS,
    enum: PlanStatus,
    example: PlanStatus.PLANNED,
  })
  @IsEnum(PlanStatus)
  @IsNotEmpty({ message: PLAN_VALIDATION_MESSAGES.PLAN_STATUS_REQUIRED || 'Status is required' })
  status: PlanStatus;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.DESCRIPTION,
    example: PLAN_API_PROPERTY_EXAMPLES.DESCRIPTION,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PHASES_LIST,
    type: [CreatePlanPhaseDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanPhaseDto)
  phases?: CreatePlanPhaseDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.PRODUCT_ID,
    example: PLAN_API_PROPERTY_EXAMPLES.PRODUCT_ID,
  })
  @IsString()
  @IsNotEmpty({ message: PLAN_VALIDATION_MESSAGES.PLAN_PRODUCT_ID_REQUIRED || 'Product ID is required' })
  productId: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.IT_OWNER,
    example: PLAN_API_PROPERTY_EXAMPLES.IT_OWNER,
    required: false,
  })
  @IsString()
  @IsOptional()
  itOwner?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.FEATURES_LIST,
    type: [String],
    example: ['feature-1', 'feature-2'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  featureIds?: string[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CALENDARS_LIST,
    type: [String],
    example: ['calendar-1'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  calendarIds?: string[];
}

