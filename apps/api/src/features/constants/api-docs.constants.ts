/**
 * Features Module API Documentation Constants
 * 
 * Constants specific to the Features module for Swagger/OpenAPI documentation
 */

import { HTTP_STATUS_CODES } from '../../common/constants';

/**
 * Features Module API Operation Summaries
 */
export const FEATURE_API_OPERATION_SUMMARIES = {
  GET_ALL: 'Obtener todas las features o filtrar por producto',
  GET_BY_ID: 'Obtener una feature por ID',
  CREATE: 'Crear una nueva feature',
  UPDATE: 'Actualizar una feature existente',
  DELETE: 'Eliminar una feature',
} as const;

/**
 * Features Module API Response Descriptions
 */
export const FEATURE_API_RESPONSE_DESCRIPTIONS = {
  LIST_RETRIEVED: 'Lista de features obtenida exitosamente',
  RETRIEVED: 'Feature obtenida exitosamente',
  CREATED: 'Feature creada exitosamente',
  UPDATED: 'Feature actualizada exitosamente',
  DELETED: 'Feature eliminada exitosamente',
  NOT_FOUND: 'Feature no encontrada',
  INVALID_INPUT: 'Datos de entrada inválidos',
  CONFLICT: 'Conflicto: nombre ya existe',
} as const;

/**
 * Features Module HTTP Status Codes
 */
export const FEATURE_HTTP_STATUS_CODES = {
  OK: HTTP_STATUS_CODES.OK,
  CREATED: HTTP_STATUS_CODES.CREATED,
  NO_CONTENT: HTTP_STATUS_CODES.NO_CONTENT,
  BAD_REQUEST: HTTP_STATUS_CODES.BAD_REQUEST,
  NOT_FOUND: HTTP_STATUS_CODES.NOT_FOUND,
  CONFLICT: HTTP_STATUS_CODES.CONFLICT,
} as const;

/**
 * Features Module API Parameter Descriptions
 */
export const FEATURE_API_PARAM_DESCRIPTIONS = {
  ID: 'ID de la feature',
  EXAMPLE_ID: 'feature-1',
  PRODUCT_ID_QUERY: 'ID del producto para filtrar features',
  PRODUCT_ID_EXAMPLE: 'product-1',
} as const;

