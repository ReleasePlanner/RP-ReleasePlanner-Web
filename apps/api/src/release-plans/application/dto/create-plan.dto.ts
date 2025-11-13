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

// Declarar las clases DTO anidadas primero para evitar problemas de inicialización
export class CreatePlanPhaseDto {
  @ApiProperty({ description: 'Nombre de la fase', example: 'Análisis' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Fecha de inicio (YYYY-MM-DD)',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'Fecha de fin (YYYY-MM-DD)',
    example: '2024-01-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Color en formato hexadecimal',
    example: '#1976D2',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
}

export class CreatePlanTaskDto {
  @ApiProperty({ description: 'Título de la tarea', example: 'Implementar feature X' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Fecha de inicio (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Color en formato hexadecimal',
    example: '#FF5733',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
}

export class CreatePlanDto {
  @ApiProperty({ description: 'Nombre del plan', example: 'Release Q1 2024' })
  @IsString()
  @IsNotEmpty({ message: 'Plan name is required' })
  name: string;

  @ApiProperty({ description: 'Propietario del plan', example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Plan owner is required' })
  owner: string;

  @ApiProperty({
    description: 'Fecha de inicio del plan (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin del plan (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  endDate: string;

  @ApiProperty({
    description: 'Estado del plan',
    enum: PlanStatus,
    example: PlanStatus.PLANNED,
    required: false,
  })
  @IsEnum(PlanStatus)
  @IsOptional()
  status?: PlanStatus;

  @ApiProperty({
    description: 'Descripción del plan',
    example: 'Plan de release para el primer trimestre',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Lista de fases del plan',
    type: [CreatePlanPhaseDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanPhaseDto)
  phases?: CreatePlanPhaseDto[];

  @ApiProperty({
    description: 'ID del producto asociado',
    example: 'product-1',
    required: false,
  })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({
    description: 'ID del propietario IT',
    example: 'owner-1',
    required: false,
  })
  @IsString()
  @IsOptional()
  itOwner?: string;

  @ApiProperty({
    description: 'IDs de las features asociadas',
    type: [String],
    example: ['feature-1', 'feature-2'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  featureIds?: string[];

  @ApiProperty({
    description: 'IDs de los calendarios asociados',
    type: [String],
    example: ['calendar-1'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  calendarIds?: string[];
}

