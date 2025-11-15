/**
 * Messages Constants
 * 
 * Centralized error and success messages
 * Used in exceptions, responses, and logging
 */

/**
 * Common Error Messages
 */
export const ERROR_MESSAGES = {
  // Resource errors
  RESOURCE_NOT_FOUND: (resource: string, id?: string) =>
    id ? `${resource} with id ${id} not found` : `${resource} not found`,
  
  RESOURCE_ALREADY_EXISTS: (resource: string, identifier: string) =>
    `${resource} with ${identifier} already exists`,
  
  // Validation errors
  VALIDATION_FAILED: 'Validation failed',
  INVALID_DATA: 'Invalid data provided',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  TOKEN_REFRESH_FAILED: 'Failed to refresh token',
  
  // Authorization errors
  FORBIDDEN: 'Access forbidden',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  
  // Database errors
  DATABASE_ERROR: 'Database error occurred',
  DATABASE_CONNECTION_FAILED: 'Database connection failed',
  
  // System errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  REQUEST_TIMEOUT: 'Request timeout',
  
  // Cache errors
  CACHE_ERROR: 'Cache error occurred',
  CACHE_CONNECTION_FAILED: 'Cache connection failed',
} as const;

/**
 * Common Success Messages
 */
export const SUCCESS_MESSAGES = {
  CREATED: (resource: string) => `${resource} created successfully`,
  UPDATED: (resource: string) => `${resource} updated successfully`,
  DELETED: (resource: string) => `${resource} deleted successfully`,
  RETRIEVED: (resource: string) => `${resource} retrieved successfully`,
  
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'User logged in successfully',
  USER_LOGGED_OUT: 'User logged out successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully',
} as const;

/**
 * Entity-specific Error Messages
 */
export const ENTITY_ERROR_MESSAGES = {
  // Base Phase
  BASE_PHASE_NAME_REQUIRED: 'Phase name is required',
  BASE_PHASE_COLOR_REQUIRED: 'Phase color is required',
  BASE_PHASE_INVALID_COLOR: 'Invalid color format. Must be a valid hex color',
  BASE_PHASE_DUPLICATE_NAME: (name: string) => `Base phase with name "${name}" already exists`,
  BASE_PHASE_DUPLICATE_COLOR: (color: string) => `Base phase with color "${color}" already exists`,
  
  // Product
  PRODUCT_NAME_REQUIRED: 'Product name is required',
  PRODUCT_DUPLICATE_NAME: (name: string) => `Product with name "${name}" already exists`,
  
  // Feature
  FEATURE_NAME_REQUIRED: 'Feature name is required',
  FEATURE_DESCRIPTION_REQUIRED: 'Feature description is required',
  FEATURE_DUPLICATE_NAME: (name: string) => `Feature with name "${name}" already exists`,
  
  // Calendar
  CALENDAR_NAME_REQUIRED: 'Calendar name is required',
  CALENDAR_DUPLICATE_NAME: (name: string) => `Calendar with name "${name}" already exists`,
  
  // IT Owner
  IT_OWNER_NAME_REQUIRED: 'IT Owner name is required',
  IT_OWNER_DUPLICATE_NAME: (name: string) => `IT Owner with name "${name}" already exists`,
  
  // Plan
  PLAN_NAME_REQUIRED: 'Plan name is required',
  PLAN_OWNER_REQUIRED: 'Plan owner is required',
  PLAN_START_DATE_REQUIRED: 'Start date is required',
  PLAN_END_DATE_REQUIRED: 'End date is required',
  PLAN_DUPLICATE_NAME: (name: string) => `Plan with name "${name}" already exists`,
  
  // User
  USER_USERNAME_REQUIRED: 'Username is required',
  USER_EMAIL_REQUIRED: 'Email is required',
  USER_PASSWORD_REQUIRED: 'Password is required',
  USER_DUPLICATE_USERNAME: (username: string) => `User with username "${username}" already exists`,
  USER_DUPLICATE_EMAIL: (email: string) => `User with email "${email}" already exists`,
} as const;

