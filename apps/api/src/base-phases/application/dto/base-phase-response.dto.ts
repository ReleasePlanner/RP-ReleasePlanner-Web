/**
 * Base Phase Response DTO
 */
import { ApiProperty } from '@nestjs/swagger';

export class BasePhaseResponseDto {
  @ApiProperty({ description: 'ID único de la fase base', example: 'base-1' })
  id: string;

  @ApiProperty({ description: 'Nombre de la fase', example: 'Análisis' })
  name: string;

  @ApiProperty({ description: 'Color en formato hexadecimal', example: '#1976D2' })
  color: string;

  @ApiProperty({ description: 'Categoría de la fase', example: 'Requerimientos', required: false })
  category?: string;

  @ApiProperty({ description: 'Fecha de creación', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(entity: {
    id: string;
    name: string;
    color: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = entity.id;
    this.name = entity.name;
    this.color = entity.color;
    this.category = entity.category;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

