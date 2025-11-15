import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCalendarDto, CreateCalendarDayDto } from './create-calendar.dto';

// DTO for updating calendar days (includes optional id for existing days)
export class UpdateCalendarDayDto extends CreateCalendarDayDto {
  @IsUUID()
  @IsOptional()
  id?: string;
}

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateCalendarDayDto)
  days?: UpdateCalendarDayDto[];
}

