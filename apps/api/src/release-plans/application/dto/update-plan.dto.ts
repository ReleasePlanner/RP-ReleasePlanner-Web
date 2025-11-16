import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto, CreatePlanPhaseDto, CreatePlanTaskDto } from './create-plan.dto';
import { IsEnum, IsOptional, IsArray, ValidateNested, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PlanStatus } from '../../domain/plan.entity';
import { PLAN_API_PROPERTY_DESCRIPTIONS, PLAN_API_PROPERTY_EXAMPLES } from '../../constants';

export class UpdatePlanMilestoneDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.MILESTONE_NAME,
    example: PLAN_API_PROPERTY_EXAMPLES.MILESTONE_NAME,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.MILESTONE_DATE,
    example: PLAN_API_PROPERTY_EXAMPLES.MILESTONE_DATE,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.MILESTONE_DESCRIPTION,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePlanReferenceDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_TYPE,
    enum: ['link', 'document', 'note', 'comment', 'file', 'milestone'],
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_TITLE,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_URL,
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_DESCRIPTION,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_DATE,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCE_PHASE_ID,
    required: false,
  })
  @IsString()
  @IsOptional()
  phaseId?: string;
}

export class UpdateGanttCellCommentDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.COMMENT_TEXT,
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.COMMENT_AUTHOR,
  })
  @IsString()
  @IsOptional()
  author?: string;
}

export class UpdateGanttCellFileDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.FILE_NAME,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.FILE_URL,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.FILE_SIZE,
    required: false,
  })
  @IsOptional()
  size?: number;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.FILE_MIME_TYPE,
    required: false,
  })
  @IsString()
  @IsOptional()
  mimeType?: string;
}

export class UpdateGanttCellLinkDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.LINK_TITLE,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.LINK_URL,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.LINK_DESCRIPTION,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateGanttCellDataDto {
  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.LINK_PHASE_ID,
    required: false,
  })
  @IsString()
  @IsOptional()
  phaseId?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CELL_DATE,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CELL_IS_MILESTONE,
    required: false,
  })
  @IsOptional()
  isMilestone?: boolean;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CELL_MILESTONE_COLOR,
    required: false,
  })
  @IsString()
  @IsOptional()
  milestoneColor?: string;

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CELL_COMMENTS,
    type: [UpdateGanttCellCommentDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateGanttCellCommentDto)
  comments?: UpdateGanttCellCommentDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CELL_FILES,
    type: [UpdateGanttCellFileDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateGanttCellFileDto)
  files?: UpdateGanttCellFileDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CELL_LINKS,
    type: [UpdateGanttCellLinkDto],
    required: false,
  })
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

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.TASKS_LIST,
    type: [CreatePlanTaskDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanTaskDto)
  tasks?: CreatePlanTaskDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.MILESTONES_LIST,
    type: [UpdatePlanMilestoneDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlanMilestoneDto)
  milestones?: UpdatePlanMilestoneDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.REFERENCES_LIST,
    type: [UpdatePlanReferenceDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlanReferenceDto)
  references?: UpdatePlanReferenceDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.CELL_DATA_LIST,
    type: [UpdateGanttCellDataDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateGanttCellDataDto)
  cellData?: UpdateGanttCellDataDto[];

  @ApiProperty({
    description: PLAN_API_PROPERTY_DESCRIPTIONS.COMPONENTS_LIST,
    required: false,
  })
  @IsArray()
  @IsOptional()
  components?: Array<{ componentId: string; finalVersion: string }>;

  @ApiProperty({
    description: 'Timestamp for optimistic locking. If provided, update will fail if plan was modified since this timestamp.',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  updatedAt?: string;
}

