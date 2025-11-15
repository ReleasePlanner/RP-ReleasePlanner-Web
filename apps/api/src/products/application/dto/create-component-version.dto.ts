/**
 * Create Component Version DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ComponentTypeEnum } from '../../domain/component-version.entity';
import { PRODUCT_VALIDATION_MESSAGES, PRODUCT_API_PROPERTY_DESCRIPTIONS, PRODUCT_API_PROPERTY_EXAMPLES } from '../../constants';

export class CreateComponentVersionDto {
  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.COMPONENT_ID,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Component name',
    required: false,
    example: 'Web Portal',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.COMPONENT_TYPE + ' (enum value for backward compatibility)',
    enum: ComponentTypeEnum,
    example: ComponentTypeEnum.WEB,
    required: false,
  })
  @IsOptional()
  @IsEnum(ComponentTypeEnum)
  type?: ComponentTypeEnum;

  @ApiProperty({
    description: 'Component Type ID (preferred)',
    required: false,
    example: 'uuid-of-component-type',
  })
  @IsOptional()
  @IsUUID()
  componentTypeId?: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.CURRENT_VERSION,
    example: PRODUCT_API_PROPERTY_EXAMPLES.CURRENT_VERSION,
  })
  @IsString()
  @IsNotEmpty({ message: PRODUCT_VALIDATION_MESSAGES.COMPONENT_CURRENT_VERSION_REQUIRED })
  currentVersion: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.PREVIOUS_VERSION,
    example: PRODUCT_API_PROPERTY_EXAMPLES.PREVIOUS_VERSION,
  })
  @IsString()
  @IsNotEmpty({ message: PRODUCT_VALIDATION_MESSAGES.COMPONENT_PREVIOUS_VERSION_REQUIRED })
  previousVersion: string;
}

