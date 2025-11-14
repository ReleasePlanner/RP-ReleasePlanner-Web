import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto, CreatePlanPhaseDto, CreatePlanTaskDto } from './create-plan.dto';
import { IsEnum, IsOptional, IsArray, ValidateNested, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PlanStatus } from '../../domain/plan.entity';

export class UpdatePlanMilestoneDto {
  @ApiProperty({ description: 'Nombre del milestone', example: 'Release Candidate' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Fecha del milestone (YYYY-MM-DD)', example: '2024-03-15' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ description: 'Descripción del milestone', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePlanReferenceDto {
  @ApiProperty({ description: 'Tipo de referencia', enum: ['link', 'document', 'note', 'comment', 'file', 'milestone'] })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Título de la referencia' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'URL de la referencia', required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Descripción de la referencia', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Fecha asociada (YYYY-MM-DD)', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ description: 'ID de la fase asociada', required: false })
  @IsString()
  @IsOptional()
  phaseId?: string;
}

export class UpdateGanttCellCommentDto {
  @ApiProperty({ description: 'Texto del comentario' })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ description: 'Autor del comentario' })
  @IsString()
  @IsOptional()
  author?: string;
}

export class UpdateGanttCellFileDto {
  @ApiProperty({ description: 'Nombre del archivo' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'URL del archivo' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Tamaño del archivo en bytes', required: false })
  @IsOptional()
  size?: number;

  @ApiProperty({ description: 'Tipo MIME del archivo', required: false })
  @IsString()
  @IsOptional()
  mimeType?: string;
}

export class UpdateGanttCellLinkDto {
  @ApiProperty({ description: 'Título del enlace' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'URL del enlace' })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'Descripción del enlace', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateGanttCellDataDto {
  @ApiProperty({ description: 'ID de la fase asociada', required: false })
  @IsString()
  @IsOptional()
  phaseId?: string;

  @ApiProperty({ description: 'Fecha de la celda (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ description: 'Indica si es un milestone', required: false })
  @IsOptional()
  isMilestone?: boolean;

  @ApiProperty({ description: 'Color del milestone', required: false })
  @IsString()
  @IsOptional()
  milestoneColor?: string;

  @ApiProperty({ description: 'Comentarios de la celda', type: [UpdateGanttCellCommentDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateGanttCellCommentDto)
  comments?: UpdateGanttCellCommentDto[];

  @ApiProperty({ description: 'Archivos de la celda', type: [UpdateGanttCellFileDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateGanttCellFileDto)
  files?: UpdateGanttCellFileDto[];

  @ApiProperty({ description: 'Enlaces de la celda', type: [UpdateGanttCellLinkDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateGanttCellLinkDto)
  links?: UpdateGanttCellLinkDto[];
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @IsEnum(PlanStatus)
  @IsOptional()
  override status?: PlanStatus;

  @ApiProperty({ description: 'Tareas del plan', type: [CreatePlanTaskDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanTaskDto)
  tasks?: CreatePlanTaskDto[];

  @ApiProperty({ description: 'Milestones del plan', type: [UpdatePlanMilestoneDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlanMilestoneDto)
  milestones?: UpdatePlanMilestoneDto[];

  @ApiProperty({ description: 'Referencias del plan', type: [UpdatePlanReferenceDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlanReferenceDto)
  references?: UpdatePlanReferenceDto[];

  @ApiProperty({ description: 'Datos de celdas del Gantt', type: [UpdateGanttCellDataDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateGanttCellDataDto)
  cellData?: UpdateGanttCellDataDto[];

  @ApiProperty({ description: 'Componentes del plan', required: false })
  @IsArray()
  @IsOptional()
  components?: Array<{ componentId: string; finalVersion: string }>;
}

