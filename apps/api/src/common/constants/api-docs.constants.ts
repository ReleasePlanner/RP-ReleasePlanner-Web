/**
 * API Documentation Constants
 * 
 * Centralized constants for Swagger/OpenAPI documentation
 * Used across all controllers and DTOs
 */

/**
 * Common API Operation Summaries
 */
export const API_OPERATION_SUMMARIES = {
  // CRUD Operations
  GET_ALL: 'Get all resources',
  GET_BY_ID: 'Get resource by ID',
  CREATE: 'Create a new resource',
  UPDATE: 'Update an existing resource',
  DELETE: 'Delete a resource',
  
  // Auth Operations
  REGISTER: 'Register a new user',
  LOGIN: 'Login user',
  LOGOUT: 'Logout user',
  REFRESH_TOKEN: 'Refresh access token',
  GET_CURRENT_USER: 'Get current user information',
  
  // Health & Info
  GET_API_INFO: 'Get API information',
  HEALTH_CHECK: 'Health check endpoint',
  METRICS: 'Prometheus metrics endpoint',
} as const;

/**
 * Common API Response Descriptions
 */
export const API_RESPONSE_DESCRIPTIONS = {
  // Success responses
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  RETRIEVED: 'Resource retrieved successfully',
  LIST_RETRIEVED: 'List of resources retrieved successfully',
  
  // Auth responses
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'User logged in successfully',
  USER_LOGGED_OUT: 'User logged out successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  CURRENT_USER_INFO: 'Current user information',
  
  // Health responses
  API_WELCOME_MESSAGE: 'Returns API welcome message',
  API_HEALTH_STATUS: 'Returns API health status',
  METRICS_RESPONSE: 'Returns Prometheus metrics in text format',
  
  // Error responses
  INVALID_INPUT: 'Invalid input data',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource conflict',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  
  // Specific error responses
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  USERNAME_EMAIL_EXISTS: 'Username or email already exists',
  DUPLICATE_NAME_COLOR: 'Conflict: name or color already exists',
} as const;

/**
 * Common HTTP Status Codes
 */
export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Common API Tags
 */
export const API_TAGS = {
  AUTH: 'auth',
  HEALTH: 'health',
  METRICS: 'metrics',
  BASE_PHASES: 'base-phases',
  PRODUCTS: 'products',
  FEATURES: 'features',
  FEATURE_CATEGORIES: 'Feature Categories',
  CALENDARS: 'calendars',
  IT_OWNERS: 'it-owners',
  COMPONENT_TYPES: 'Component Types',
  COUNTRIES: 'Countries',
  PLANS: 'plans',
} as const;

/**
 * Common API Parameter Descriptions
 */
export const API_PARAM_DESCRIPTIONS = {
  ID: 'Resource ID',
  BASE_PHASE_ID: 'Base phase ID',
  PRODUCT_ID: 'Product ID',
  FEATURE_ID: 'Feature ID',
  CALENDAR_ID: 'Calendar ID',
  IT_OWNER_ID: 'IT Owner ID',
  PLAN_ID: 'Plan ID',
} as const;

/**
 * Common API Property Descriptions
 */
export const API_PROPERTY_DESCRIPTIONS = {
  ID: 'Unique resource identifier',
  NAME: 'Resource name',
  EMAIL: 'Email address',
  USERNAME: 'Username',
  USERNAME_OR_EMAIL: 'Username or email',
  PASSWORD: 'Password',
  FIRST_NAME: 'First name',
  LAST_NAME: 'Last name',
  DESCRIPTION: 'Resource description',
  CREATED_AT: 'Creation date',
  UPDATED_AT: 'Last update date',
  DATE: 'Date in ISO format (YYYY-MM-DD)',
  START_DATE: 'Start date (YYYY-MM-DD)',
  END_DATE: 'End date (YYYY-MM-DD)',
  DATETIME: 'Date and time in ISO format',
  COLOR: 'Color in hexadecimal format',
  CATEGORY: 'Category',
  STATUS: 'Status',
  ROLE: 'User role',
  ACCESS_TOKEN: 'JWT access token',
  REFRESH_TOKEN: 'Refresh token',
  USER_INFO: 'User information',
  COMPONENTS_LIST: 'List of components',
  PHASES_LIST: 'List of phases',
  TASKS_LIST: 'List of tasks',
  MILESTONES_LIST: 'List of milestones',
  REFERENCES_LIST: 'List of references',
  CELL_DATA_LIST: 'List of cell data',
  FEATURES_LIST: 'List of features',
  CALENDAR_DAYS_LIST: 'List of calendar days',
} as const;

/**
 * Common API Property Examples
 */
export const API_PROPERTY_EXAMPLES = {
  USERNAME: 'johndoe',
  USERNAME_ADMIN: 'admin',
  EMAIL: 'john.doe@example.com',
  PASSWORD: 'SecurePassword123!',
  PASSWORD_SIMPLE: 'password123',
  FIRST_NAME: 'John',
  LAST_NAME: 'Doe',
  NAME_PRODUCT: 'Sistema de Gestión',
  NAME_PHASE: 'Análisis',
  NAME_PLAN: 'Release Q1 2024',
  NAME_FEATURE: 'Feature Name',
  NAME_CALENDAR: 'Calendar Name',
  NAME_IT_OWNER: 'IT Owner Name',
  OWNER: 'John Doe',
  DESCRIPTION: 'Resource description',
  DESCRIPTION_PLAN: 'Plan de release para el primer trimestre',
  COLOR_HEX: '#1976D2',
  COLOR_HEX_ALT: '#FF5733',
  DATE_START: '2024-01-01',
  DATE_END: '2024-12-31',
  DATE_MID: '2024-01-31',
  DATE_TASK_END: '2024-01-15',
  DATE_MILESTONE: '2024-03-15',
  DATETIME: '2024-01-01T00:00:00.000Z',
  ID_BASE: 'base-1',
  ID_PRODUCT: 'product-1',
  ID_FEATURE: 'feature-1',
  ID_CALENDAR: 'calendar-1',
  ID_OWNER: 'owner-1',
  ID_PLAN: 'plan-1',
  ID_COMPONENT: 'comp-1',
  TASK_TITLE: 'Implementar feature X',
  MILESTONE_NAME: 'Release Candidate',
  CATEGORY: 'Requerimientos',
  VERSION_CURRENT: '1.2.3',
  VERSION_PREVIOUS: '1.2.2',
  COMPONENT_TYPE_WEB: 'web',
  TOKEN_JWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
} as const;

