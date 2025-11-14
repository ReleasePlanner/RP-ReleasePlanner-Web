/**
 * Helper decorators for Swagger documentation
 * 
 * Common ApiProperty decorators for reuse across DTOs
 */
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * ApiProperty decorator for ID fields
 */
export const ApiPropertyId = (options?: Partial<ApiPropertyOptions>) =>
  ApiProperty({
    description: 'ID único del recurso',
    example: 'resource-123',
    ...options,
  } as ApiPropertyOptions);

/**
 * ApiProperty decorator for name fields
 */
export const ApiPropertyName = (options?: Partial<ApiPropertyOptions>) =>
  ApiProperty({
    description: 'Nombre del recurso',
    example: 'Nombre del recurso',
    minLength: 1,
    ...options,
  } as ApiPropertyOptions);

/**
 * ApiProperty decorator for date fields
 */
export const ApiPropertyDate = (options?: Partial<ApiPropertyOptions>) =>
  ApiProperty({
    description: 'Fecha en formato ISO (YYYY-MM-DD)',
    example: '2024-01-01',
    type: 'string' as const,
    ...options,
  } as ApiPropertyOptions);

/**
 * ApiProperty decorator for datetime fields
 */
export const ApiPropertyDateTime = (options?: Partial<ApiPropertyOptions>) =>
  ApiProperty({
    description: 'Fecha y hora en formato ISO',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
    ...options,
  } as ApiPropertyOptions);

/**
 * ApiProperty decorator for optional string fields
 */
export const ApiPropertyOptionalString = (
  description: string,
  example?: string,
) =>
  ApiProperty({
    description,
    example,
    required: false,
    type: 'string' as const,
  } as ApiPropertyOptions);

