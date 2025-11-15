/**
 * Calendars Module API Documentation Constants
 * 
 * Constants specific to the Calendars module for Swagger/OpenAPI documentation
 */

import { HTTP_STATUS_CODES } from '../../common/constants';

/**
 * Calendars Module API Operation Summaries
 */
export const CALENDAR_API_OPERATION_SUMMARIES = {
  GET_ALL: 'Obtener todos los calendarios',
  GET_BY_ID: 'Obtener un calendario por ID',
  CREATE: 'Crear un nuevo calendario',
  UPDATE: 'Actualizar un calendario existente',
  DELETE: 'Eliminar un calendario',
} as const;

/**
 * Calendars Module API Response Descriptions
 */
export const CALENDAR_API_RESPONSE_DESCRIPTIONS = {
  LIST_RETRIEVED: 'Lista de calendarios obtenida exitosamente',
  RETRIEVED: 'Calendario obtenido exitosamente',
  CREATED: 'Calendario creado exitosamente',
  UPDATED: 'Calendario actualizado exitosamente',
  DELETED: 'Calendario eliminado exitosamente',
  NOT_FOUND: 'Calendario no encontrado',
  INVALID_INPUT: 'Datos de entrada inválidos',
  CONFLICT: 'Conflicto: nombre ya existe',
} as const;

/**
 * Calendars Module HTTP Status Codes
 */
export const CALENDAR_HTTP_STATUS_CODES = {
  OK: HTTP_STATUS_CODES.OK,
  CREATED: HTTP_STATUS_CODES.CREATED,
  NO_CONTENT: HTTP_STATUS_CODES.NO_CONTENT,
  BAD_REQUEST: HTTP_STATUS_CODES.BAD_REQUEST,
  NOT_FOUND: HTTP_STATUS_CODES.NOT_FOUND,
  CONFLICT: HTTP_STATUS_CODES.CONFLICT,
} as const;

/**
 * Calendars Module API Parameter Descriptions
 */
export const CALENDAR_API_PARAM_DESCRIPTIONS = {
  ID: 'ID del calendario',
  EXAMPLE_ID: 'calendar-1',
} as const;

