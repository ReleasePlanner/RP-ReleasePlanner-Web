/**
 * Update Product DTO
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'Timestamp for optimistic locking. If provided, update will fail if product was modified since this timestamp.',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  updatedAt?: string; // For optimistic locking

  @ApiProperty({
    description: 'Flag to indicate partial update from external transaction (e.g., plan update). When true, components not in the update array will be preserved.',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  _partialUpdate?: boolean; // Flag to prevent component deletion in partial updates
}

