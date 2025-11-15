/**
 * Component Types Module API Documentation Constants
 * 
 * Constants specific to the Component Types module for Swagger/OpenAPI documentation
 */

import { HTTP_STATUS_CODES } from '../../common/constants';

/**
 * Component Types Module API Operation Summaries
 */
export const COMPONENT_TYPE_API_OPERATION_SUMMARIES = {
  GET_ALL: 'Obtener todos los tipos de componente',
  GET_BY_ID: 'Obtener un tipo de componente por ID',
  CREATE: 'Crear un nuevo tipo de componente',
  UPDATE: 'Actualizar un tipo de componente existente',
  DELETE: 'Eliminar un tipo de componente',
} as const;

/**
 * Component Types Module API Response Descriptions
 */
export const COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS = {
  LIST_RETRIEVED: 'Lista de tipos de componente obtenida exitosamente',
  RETRIEVED: 'Tipo de componente obtenido exitosamente',
  CREATED: 'Tipo de componente creado exitosamente',
  UPDATED: 'Tipo de componente actualizado exitosamente',
  DELETED: 'Tipo de componente eliminado exitosamente',
  NOT_FOUND: 'Tipo de componente no encontrado',
  INVALID_INPUT: 'Datos de entrada inválidos',
  CONFLICT: 'Conflicto: nombre ya existe',
} as const;

/**
 * Component Types Module HTTP Status Codes
 */
export const COMPONENT_TYPE_HTTP_STATUS_CODES = {
  OK: HTTP_STATUS_CODES.OK,
  CREATED: HTTP_STATUS_CODES.CREATED,
  NO_CONTENT: HTTP_STATUS_CODES.NO_CONTENT,
  BAD_REQUEST: HTTP_STATUS_CODES.BAD_REQUEST,
  NOT_FOUND: HTTP_STATUS_CODES.NOT_FOUND,
  CONFLICT: HTTP_STATUS_CODES.CONFLICT,
} as const;

/**
 * Component Types Module API Parameter Descriptions
 */
export const COMPONENT_TYPE_API_PARAM_DESCRIPTIONS = {
  ID: 'ID del tipo de componente',
  EXAMPLE_ID: 'component-type-1',
} as const;

