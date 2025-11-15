import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CalendarDayType } from '../../domain/calendar-day.entity';
import { CALENDAR_VALIDATION_MESSAGES } from '../../constants';

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
  @IsNotEmpty({ message: CALENDAR_VALIDATION_MESSAGES.CALENDAR_NAME_REQUIRED })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCalendarDayDto)
  days?: CreateCalendarDayDto[];

  @IsUUID()
  @IsOptional()
  countryId?: string;
}

