/**
 * Product Response DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { ComponentVersion } from '../../domain/component-version.entity';
import { PRODUCT_API_PROPERTY_DESCRIPTIONS, PRODUCT_API_PROPERTY_EXAMPLES } from '../../constants';
import { API_PROPERTY_DESCRIPTIONS } from '../../../common/constants';

export class ComponentVersionResponseDto {
  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.COMPONENT_ID,
    example: PRODUCT_API_PROPERTY_EXAMPLES.COMPONENT_ID,
  })
  id: string;

  @ApiProperty({
    description: 'Component name',
    required: false,
    example: 'Web Portal',
  })
  name?: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.COMPONENT_TYPE,
    example: PRODUCT_API_PROPERTY_EXAMPLES.COMPONENT_TYPE,
  })
  type: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.CURRENT_VERSION,
    example: PRODUCT_API_PROPERTY_EXAMPLES.CURRENT_VERSION,
  })
  currentVersion: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.PREVIOUS_VERSION,
    example: PRODUCT_API_PROPERTY_EXAMPLES.PREVIOUS_VERSION,
  })
  previousVersion: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.CREATED_AT,
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.UPDATED_AT,
    type: Date,
  })
  updatedAt: Date;

  constructor(entity: ComponentVersion) {
    this.id = entity.id;
    this.name = entity.name;
    // Use componentType.code if available, otherwise fallback to enum type
    this.type = entity.componentType?.code || entity.getTypeCode() || entity.type || '';
    this.currentVersion = entity.currentVersion;
    this.previousVersion = entity.previousVersion;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class ProductResponseDto {
  @ApiProperty({
    description: API_PROPERTY_DESCRIPTIONS.ID,
    example: PRODUCT_API_PROPERTY_EXAMPLES.ID,
  })
  id: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.NAME,
    example: PRODUCT_API_PROPERTY_EXAMPLES.NAME,
  })
  name: string;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.COMPONENTS_LIST,
    type: [ComponentVersionResponseDto],
  })
  components: ComponentVersionResponseDto[];

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.CREATED_AT,
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: PRODUCT_API_PROPERTY_DESCRIPTIONS.UPDATED_AT,
    type: Date,
  })
  updatedAt: Date;

  constructor(entity: {
    id: string;
    name: string;
    components?: ComponentVersion[] | any[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = entity.id;
    this.name = entity.name;
    this.components = (entity.components && Array.isArray(entity.components))
      ? entity.components
          .filter((c) => c != null)
          .map((c) => new ComponentVersionResponseDto(c))
      : [];
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

