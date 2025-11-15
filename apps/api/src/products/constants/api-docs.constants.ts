/**
 * Products Module API Documentation Constants
 * 
 * Constants specific to the Products module for Swagger/OpenAPI documentation
 */

import { HTTP_STATUS_CODES } from '../../common/constants';

/**
 * Products Module API Operation Summaries
 */
export const PRODUCT_API_OPERATION_SUMMARIES = {
  GET_ALL: 'Obtener todos los productos',
  GET_BY_ID: 'Obtener un producto por ID',
  CREATE: 'Crear un nuevo producto',
  UPDATE: 'Actualizar un producto existente',
  DELETE: 'Eliminar un producto',
} as const;

/**
 * Products Module API Response Descriptions
 */
export const PRODUCT_API_RESPONSE_DESCRIPTIONS = {
  LIST_RETRIEVED: 'Lista de productos obtenida exitosamente',
  RETRIEVED: 'Producto obtenido exitosamente',
  CREATED: 'Producto creado exitosamente',
  UPDATED: 'Producto actualizado exitosamente',
  DELETED: 'Producto eliminado exitosamente',
  NOT_FOUND: 'Producto no encontrado',
  INVALID_INPUT: 'Datos de entrada inválidos',
  CONFLICT: 'Conflicto: nombre ya existe',
} as const;

/**
 * Products Module HTTP Status Codes
 */
export const PRODUCT_HTTP_STATUS_CODES = {
  OK: HTTP_STATUS_CODES.OK,
  CREATED: HTTP_STATUS_CODES.CREATED,
  NO_CONTENT: HTTP_STATUS_CODES.NO_CONTENT,
  BAD_REQUEST: HTTP_STATUS_CODES.BAD_REQUEST,
  NOT_FOUND: HTTP_STATUS_CODES.NOT_FOUND,
  CONFLICT: HTTP_STATUS_CODES.CONFLICT,
} as const;

/**
 * Products Module API Parameter Descriptions
 */
export const PRODUCT_API_PARAM_DESCRIPTIONS = {
  ID: 'ID del producto',
  EXAMPLE_ID: 'product-1',
} as const;

