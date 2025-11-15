/**
 * IT Owners Module API Documentation Constants
 * 
 * Constants specific to the IT Owners module for Swagger/OpenAPI documentation
 */

import { HTTP_STATUS_CODES } from '../../common/constants';

/**
 * IT Owners Module API Operation Summaries
 */
export const IT_OWNER_API_OPERATION_SUMMARIES = {
  GET_ALL: 'Obtener todos los propietarios IT',
  GET_BY_ID: 'Obtener un propietario IT por ID',
  CREATE: 'Crear un nuevo propietario IT',
  UPDATE: 'Actualizar un propietario IT existente',
  DELETE: 'Eliminar un propietario IT',
} as const;

/**
 * IT Owners Module API Response Descriptions
 */
export const IT_OWNER_API_RESPONSE_DESCRIPTIONS = {
  LIST_RETRIEVED: 'Lista de propietarios IT obtenida exitosamente',
  RETRIEVED: 'Propietario IT obtenido exitosamente',
  CREATED: 'Propietario IT creado exitosamente',
  UPDATED: 'Propietario IT actualizado exitosamente',
  DELETED: 'Propietario IT eliminado exitosamente',
  NOT_FOUND: 'Propietario IT no encontrado',
  INVALID_INPUT: 'Datos de entrada inválidos',
  CONFLICT: 'Conflicto: nombre ya existe',
} as const;

/**
 * IT Owners Module HTTP Status Codes
 */
export const IT_OWNER_HTTP_STATUS_CODES = {
  OK: HTTP_STATUS_CODES.OK,
  CREATED: HTTP_STATUS_CODES.CREATED,
  NO_CONTENT: HTTP_STATUS_CODES.NO_CONTENT,
  BAD_REQUEST: HTTP_STATUS_CODES.BAD_REQUEST,
  NOT_FOUND: HTTP_STATUS_CODES.NOT_FOUND,
  CONFLICT: HTTP_STATUS_CODES.CONFLICT,
} as const;

/**
 * IT Owners Module API Parameter Descriptions
 */
export const IT_OWNER_API_PARAM_DESCRIPTIONS = {
  ID: 'ID del propietario IT',
  EXAMPLE_ID: 'owner-1',
} as const;

