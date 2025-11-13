/**
 * Create Product DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateComponentVersionDto } from './create-component-version.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Sistema de Gestión',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @ApiProperty({
    description: 'Lista de componentes del producto',
    type: [CreateComponentVersionDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateComponentVersionDto)
  components?: CreateComponentVersionDto[];
}

