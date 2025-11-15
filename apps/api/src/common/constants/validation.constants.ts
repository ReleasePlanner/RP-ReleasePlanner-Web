/**
 * Validation Constants
 * 
 * Centralized validation messages and rules
 * Used in DTOs and entity validations
 */

/**
 * Common Validation Messages
 */
export const VALIDATION_MESSAGES = {
  // Required fields
  REQUIRED: (field: string) => `${field} is required`,
  NOT_EMPTY: (field: string) => `${field} cannot be empty`,
  
  // String validations
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
  INVALID_FORMAT: (field: string, format: string) => `Invalid ${field} format. Must be ${format}`,
  
  // Type validations
  MUST_BE_STRING: (field: string) => `${field} must be a string`,
  MUST_BE_NUMBER: (field: string) => `${field} must be a number`,
  MUST_BE_BOOLEAN: (field: string) => `${field} must be a boolean`,
  MUST_BE_ARRAY: (field: string) => `${field} must be an array`,
  MUST_BE_EMAIL: (field: string) => `Invalid ${field} format`,
  
  // Pattern validations
  INVALID_PATTERN: (field: string, pattern: string) => `${field} does not match required pattern: ${pattern}`,
  
  // Range validations
  MIN_VALUE: (field: string, min: number) => `${field} must be at least ${min}`,
  MAX_VALUE: (field: string, max: number) => `${field} must not exceed ${max}`,
  
  // Date validations
  INVALID_DATE: (field: string) => `Invalid ${field} format. Must be a valid date`,
  INVALID_DATE_FORMAT: (field: string, format: string) => `Invalid ${field} format. Must be ${format}`,
  
  // Custom validations
  INVALID_COLOR: 'Color must be a valid hex color (e.g., #FF5733)',
  INVALID_USERNAME: 'Username can only contain letters, numbers, and underscores',
  INVALID_PASSWORD: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
} as const;

/**
 * Field-specific Validation Messages
 */
export const FIELD_VALIDATION_MESSAGES = {
  // Auth fields
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_MIN_LENGTH: 'Username must be at least 3 characters',
  USERNAME_PATTERN: 'Username can only contain letters, numbers, and underscores',
  
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_PATTERN: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  PASSWORD_LOGIN_MIN_LENGTH: 'Password must be at least 6 characters',
  
  // Common fields
  NAME_REQUIRED: 'Name is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  
  // Base Phase fields
  PHASE_NAME_REQUIRED: 'Phase name is required',
  PHASE_COLOR_REQUIRED: 'Phase color is required',
  PHASE_COLOR_INVALID: 'Color must be a valid hex color (e.g., #FF5733)',
  
  // Product fields
  PRODUCT_NAME_REQUIRED: 'Product name is required',
  COMPONENT_CURRENT_VERSION_REQUIRED: 'Current version is required',
  COMPONENT_PREVIOUS_VERSION_REQUIRED: 'Previous version is required',
  
  // Feature fields
  FEATURE_NAME_REQUIRED: 'Feature name is required',
  FEATURE_DESCRIPTION_REQUIRED: 'Feature description is required',
  FEATURE_TECHNICAL_DESCRIPTION_REQUIRED: 'Technical description is required',
  FEATURE_BUSINESS_DESCRIPTION_REQUIRED: 'Business description is required',
  FEATURE_PRODUCT_ID_REQUIRED: 'Product ID is required',
  
  // Calendar fields
  CALENDAR_NAME_REQUIRED: 'Calendar name is required',
  
  // IT Owner fields
  IT_OWNER_NAME_REQUIRED: 'IT Owner name is required',
  
  // Plan fields
  PLAN_NAME_REQUIRED: 'Plan name is required',
  PLAN_OWNER_REQUIRED: 'Plan owner is required',
  PLAN_START_DATE_REQUIRED: 'Start date is required',
  PLAN_END_DATE_REQUIRED: 'End date is required',
} as const;

/**
 * Validation Rules (min/max lengths, patterns, etc.)
 */
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    LOGIN_MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  COLOR: {
    PATTERN: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  },
  DATE_FORMAT: {
    ISO_DATE: /^\d{4}-\d{2}-\d{2}$/,
    ISO_DATETIME: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
  },
} as const;

