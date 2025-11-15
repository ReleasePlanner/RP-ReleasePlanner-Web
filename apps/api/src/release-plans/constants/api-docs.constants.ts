/**
 * Release Plans Module API Documentation Constants
 * 
 * Constants specific to the Release Plans module for Swagger/OpenAPI documentation
 */

import { HTTP_STATUS_CODES } from '../../common/constants';

/**
 * Release Plans Module API Operation Summaries
 */
export const PLAN_API_OPERATION_SUMMARIES = {
  GET_ALL: 'Obtener todos los planes de release',
  GET_BY_ID: 'Obtener un plan de release por ID',
  CREATE: 'Crear un nuevo plan de release',
  UPDATE: 'Actualizar un plan de release existente',
  DELETE: 'Eliminar un plan de release',
} as const;

/**
 * Release Plans Module API Response Descriptions
 */
export const PLAN_API_RESPONSE_DESCRIPTIONS = {
  LIST_RETRIEVED: 'Lista de planes obtenida exitosamente',
  RETRIEVED: 'Plan obtenido exitosamente',
  CREATED: 'Plan creado exitosamente',
  UPDATED: 'Plan actualizado exitosamente',
  DELETED: 'Plan eliminado exitosamente',
  NOT_FOUND: 'Plan no encontrado',
  INVALID_INPUT: 'Datos de entrada inválidos',
  CONFLICT: 'Conflicto: nombre ya existe',
} as const;

/**
 * Release Plans Module HTTP Status Codes
 */
export const PLAN_HTTP_STATUS_CODES = {
  OK: HTTP_STATUS_CODES.OK,
  CREATED: HTTP_STATUS_CODES.CREATED,
  NO_CONTENT: HTTP_STATUS_CODES.NO_CONTENT,
  BAD_REQUEST: HTTP_STATUS_CODES.BAD_REQUEST,
  NOT_FOUND: HTTP_STATUS_CODES.NOT_FOUND,
  CONFLICT: HTTP_STATUS_CODES.CONFLICT,
} as const;

/**
 * Release Plans Module API Parameter Descriptions
 */
export const PLAN_API_PARAM_DESCRIPTIONS = {
  ID: 'ID del plan',
  EXAMPLE_ID: 'plan-1',
} as const;

