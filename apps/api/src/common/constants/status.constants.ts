/**
 * Status Constants
 * 
 * Centralized status values used across the application
 * Used in health checks, responses, and entity states
 */

/**
 * Health Check Status Values
 */
export const HEALTH_STATUS = {
  OK: 'ok',
  ERROR: 'error',
  WARNING: 'warning',
  DEGRADED: 'degraded',
} as const;

/**
 * Health Check Messages
 */
export const HEALTH_MESSAGES = {
  CACHE_WORKING: 'Cache is working',
  CACHE_TEST_FAILED: 'Cache test failed',
  CACHE_CONNECTION_FAILED: 'Cache connection failed',
  CACHE_ERROR: 'Cache error',
} as const;

/**
 * Common Response Status Messages
 */
export const RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
  PROCESSING: 'processing',
} as const;

