/**
 * Create Component Version DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ComponentType } from '../../domain/component-version.entity';

export class CreateComponentVersionDto {
  @ApiProperty({
    description: 'Tipo de componente',
    enum: ComponentType,
    example: ComponentType.WEB,
  })
  @IsEnum(ComponentType)
  type: ComponentType;

  @ApiProperty({
    description: 'Versión actual del componente',
    example: '1.2.3',
  })
  @IsString()
  @IsNotEmpty({ message: 'Current version is required' })
  currentVersion: string;

  @ApiProperty({
    description: 'Versión anterior del componente',
    example: '1.2.2',
  })
  @IsString()
  @IsNotEmpty({ message: 'Previous version is required' })
  previousVersion: string;
}

