/**
 * Create Product DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateComponentVersionDto } from './create-component-version.dto';
import { PRODUCT_VALIDATION_MESSAGES, PRODUCT_API_PROPERTY_DESCRIPTIONS, PRODUCT_API_PROPERTY_EXAMPLES } from '../../constants';

export class CreateProductDto {
  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.NAME,
    example: PRODUCT_API_PROPERTY_EXAMPLES.NAME,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: PRODUCT_VALIDATION_MESSAGES.PRODUCT_NAME_REQUIRED })
  name: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.COMPONENTS_LIST,
    type: [CreateComponentVersionDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateComponentVersionDto)
  components?: CreateComponentVersionDto[];
}

