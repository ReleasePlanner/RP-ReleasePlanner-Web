/**
 * Base Phase Response DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { BASE_PHASE_API_PROPERTY_DESCRIPTIONS, BASE_PHASE_API_PROPERTY_EXAMPLES } from '../../constants';
import { API_PROPERTY_DESCRIPTIONS } from '../../../common/constants';

export class BasePhaseResponseDto {
  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.ID,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.ID,
  })
  id: string;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.NAME,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.NAME,
  })
  name: string;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.COLOR,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.COLOR,
  })
  color: string;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.CREATED_AT,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.DATETIME,
  })
  createdAt: Date;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.UPDATED_AT,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.DATETIME,
  })
  updatedAt: Date;

  constructor(entity: {
    id: string;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = entity.id;
    this.name = entity.name;
    this.color = entity.color;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

