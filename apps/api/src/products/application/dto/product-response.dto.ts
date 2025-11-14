/**
 * Product Response DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { ComponentVersion } from '../../domain/component-version.entity';

export class ComponentVersionResponseDto {
  @ApiProperty({ description: 'ID del componente', example: 'comp-1' })
  id: string;

  @ApiProperty({ description: 'Tipo de componente', example: 'web' })
  type: string;

  @ApiProperty({ description: 'Versión actual', example: '1.2.3' })
  currentVersion: string;

  @ApiProperty({ description: 'Versión anterior', example: '1.2.2' })
  previousVersion: string;

  @ApiProperty({ description: 'Fecha de creación', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización', type: Date })
  updatedAt: Date;

  constructor(entity: ComponentVersion) {
    this.id = entity.id;
    this.type = entity.type;
    this.currentVersion = entity.currentVersion;
    this.previousVersion = entity.previousVersion;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class ProductResponseDto {
  @ApiProperty({ description: 'ID del producto', example: 'product-1' })
  id: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Sistema de Gestión' })
  name: string;

  @ApiProperty({
    description: 'Lista de componentes del producto',
    type: [ComponentVersionResponseDto],
  })
  components: ComponentVersionResponseDto[];

  @ApiProperty({ description: 'Fecha de creación', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización', type: Date })
  updatedAt: Date;

  constructor(entity: {
    id: string;
    name: string;
    components: ComponentVersion[] | any[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = entity.id;
    this.name = entity.name;
    this.components = entity.components.map((c) => new ComponentVersionResponseDto(c));
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

