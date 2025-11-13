import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CalendarDayType } from '../../domain/calendar-day.entity';

// Declarar la clase DTO anidada primero para evitar problemas de inicialización
export class CreateCalendarDayDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsEnum(CalendarDayType)
  type: CalendarDayType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  recurring: boolean;
}

export class CreateCalendarDto {
  @IsString()
  @IsNotEmpty({ message: 'Calendar name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCalendarDayDto)
  days?: CreateCalendarDayDto[];
}

