/**
 * Base Phases Module API Documentation Constants
 * 
 * Constants specific to the Base Phases module for Swagger/OpenAPI documentation
 */

import { HTTP_STATUS_CODES } from '../../common/constants';

/**
 * Base Phases Module API Operation Summaries
 */
export const BASE_PHASE_API_OPERATION_SUMMARIES = {
  GET_ALL: 'Obtener todas las fases base',
  GET_BY_ID: 'Obtener una fase base por ID',
  CREATE: 'Crear una nueva fase base',
  UPDATE: 'Actualizar una fase base existente',
  DELETE: 'Eliminar una fase base',
} as const;

/**
 * Base Phases Module API Response Descriptions
 */
export const BASE_PHASE_API_RESPONSE_DESCRIPTIONS = {
  LIST_RETRIEVED: 'Lista de fases base obtenida exitosamente',
  RETRIEVED: 'Fase base obtenida exitosamente',
  CREATED: 'Fase base creada exitosamente',
  UPDATED: 'Fase base actualizada exitosamente',
  DELETED: 'Fase base eliminada exitosamente',
  NOT_FOUND: 'Fase base no encontrada',
  INVALID_INPUT: 'Datos de entrada inválidos',
  CONFLICT: 'Conflicto: nombre o color ya existe',
} as const;

/**
 * Base Phases Module HTTP Status Codes
 */
export const BASE_PHASE_HTTP_STATUS_CODES = {
  OK: HTTP_STATUS_CODES.OK,
  CREATED: HTTP_STATUS_CODES.CREATED,
  NO_CONTENT: HTTP_STATUS_CODES.NO_CONTENT,
  BAD_REQUEST: HTTP_STATUS_CODES.BAD_REQUEST,
  NOT_FOUND: HTTP_STATUS_CODES.NOT_FOUND,
  CONFLICT: HTTP_STATUS_CODES.CONFLICT,
} as const;

/**
 * Base Phases Module API Parameter Descriptions
 */
export const BASE_PHASE_API_PARAM_DESCRIPTIONS = {
  ID: 'ID de la fase base',
  EXAMPLE_ID: 'base-1',
} as const;

