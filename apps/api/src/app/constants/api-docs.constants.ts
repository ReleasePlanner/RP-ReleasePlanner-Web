/**
 * App Module API Documentation Constants
 * 
 * Constants specific to the App module for Swagger/OpenAPI documentation
 */

import { API_OPERATION_SUMMARIES, API_RESPONSE_DESCRIPTIONS, HTTP_STATUS_CODES } from '../../common/constants';

/**
 * App Module API Operation Summaries
 */
export const APP_API_OPERATION_SUMMARIES = {
  GET_API_INFO: API_OPERATION_SUMMARIES.GET_API_INFO,
  HEALTH_CHECK: API_OPERATION_SUMMARIES.HEALTH_CHECK,
} as const;

/**
 * App Module API Response Descriptions
 */
export const APP_API_RESPONSE_DESCRIPTIONS = {
  API_WELCOME_MESSAGE: API_RESPONSE_DESCRIPTIONS.API_WELCOME_MESSAGE,
  API_HEALTH_STATUS: API_RESPONSE_DESCRIPTIONS.API_HEALTH_STATUS,
} as const;

/**
 * App Module HTTP Status Codes
 */
export const APP_HTTP_STATUS_CODES = {
  OK: HTTP_STATUS_CODES.OK,
} as const;

/**
 * Health Check Schema Examples
 */
export const HEALTH_SCHEMA_EXAMPLES = {
  STATUS_OK: 'ok',
  TIMESTAMP_EXAMPLE: '2024-01-01T00:00:00.000Z',
} as const;

