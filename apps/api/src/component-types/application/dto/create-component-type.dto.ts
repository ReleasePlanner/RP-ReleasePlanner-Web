import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { COMPONENT_TYPE_VALIDATION_MESSAGES } from '../../constants';

export class CreateComponentTypeDto {
  @IsString()
  @IsNotEmpty({ message: COMPONENT_TYPE_VALIDATION_MESSAGES.COMPONENT_TYPE_NAME_REQUIRED })
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

