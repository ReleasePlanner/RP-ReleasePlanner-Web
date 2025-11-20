/**
 * Advanced Error Handling and Categorization
 * 
 * Categorizes errors and provides appropriate handling strategies
 */

import { HttpClientError } from '../httpClient';
import { BulkheadRejectedError, BulkheadTimeoutError } from './Bulkhead';

export enum ErrorCategory {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER_ERROR = 'SERVER_ERROR',
  CIRCUIT_BREAKER = 'CIRCUIT_BREAKER',
  BULKHEAD_REJECTED = 'BULKHEAD_REJECTED',
  BULKHEAD_TIMEOUT = 'BULKHEAD_TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorContext {
  category: ErrorCategory;
  retryable: boolean;
  userMessage: string;
  technicalMessage: string;
  statusCode?: number;
  code?: string;
  correlationId?: string;
}

/**
 * Categorize error and provide context
 */
export function categorizeError(error: any): ErrorContext {
  // Bulkhead errors - check before circuit breaker as they're more specific
  if (error instanceof BulkheadRejectedError || error?.name === 'BulkheadRejectedError') {
    return {
      category: ErrorCategory.BULKHEAD_REJECTED,
      retryable: true,
      userMessage: 'Demasiadas solicitudes simultáneas. Por favor, intente nuevamente en breve.',
      technicalMessage: `Bulkhead rejected: ${error.message}`,
    };
  }

  if (error instanceof BulkheadTimeoutError || error?.name === 'BulkheadTimeoutError') {
    return {
      category: ErrorCategory.BULKHEAD_TIMEOUT,
      retryable: true,
      userMessage: 'La solicitud excedió el tiempo de espera en la cola. Por favor, intente nuevamente.',
      technicalMessage: `Bulkhead timeout: ${error.message}`,
    };
  }

  // Circuit breaker errors
  if (error?.name === 'CircuitBreakerOpenError') {
    return {
      category: ErrorCategory.CIRCUIT_BREAKER,
      retryable: false,
      userMessage: 'El servicio no está disponible temporalmente. Por favor, intente más tarde.',
      technicalMessage: `Circuit breaker is OPEN: ${error.message}`,
    };
  }

  // Network errors
  if (error?.isNetworkError || error?.code === 'NETWORK_ERROR') {
    return {
      category: ErrorCategory.NETWORK,
      retryable: true,
      userMessage: 'Error de conexión. Verifique su conexión a internet e intente nuevamente.',
      technicalMessage: `Network error: ${error.message}`,
      statusCode: error?.statusCode,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // Timeout errors
  if (error?.isTimeout || error?.code === 'TIMEOUT' || error?.statusCode === 408) {
    return {
      category: ErrorCategory.TIMEOUT,
      retryable: true,
      userMessage: 'La solicitud tardó demasiado tiempo. Por favor, intente nuevamente.',
      technicalMessage: `Request timeout: ${error.message}`,
      statusCode: 408,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // Authentication errors
  if (error?.statusCode === 401 || error?.code === 'UNAUTHORIZED') {
    return {
      category: ErrorCategory.AUTHENTICATION,
      retryable: false,
      userMessage: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
      technicalMessage: `Authentication error: ${error.message}`,
      statusCode: 401,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // Authorization errors
  if (error?.statusCode === 403 || error?.code === 'FORBIDDEN') {
    return {
      category: ErrorCategory.AUTHORIZATION,
      retryable: false,
      userMessage: 'No tiene permisos para realizar esta acción.',
      technicalMessage: `Authorization error: ${error.message}`,
      statusCode: 403,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // Validation errors (400 Bad Request) - check message for validation keywords
  if (
    error?.statusCode === 400 || 
    error?.code === 'VALIDATION_ERROR' ||
    (error?.message && (
      error.message.includes('debe ser mayor') ||
      error.message.includes('no es válido') ||
      error.message.includes('es obligatorio') ||
      error.message.includes('es requerido') ||
      error.message.includes('Bad Request')
    ))
  ) {
    return {
      category: ErrorCategory.VALIDATION,
      retryable: false, // NEVER retry validation errors
      userMessage: error?.message || 'Los datos proporcionados no son válidos.',
      technicalMessage: `Validation error: ${error.message}`,
      statusCode: 400,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // Not found errors
  if (error?.statusCode === 404 || error?.code === 'NOT_FOUND') {
    return {
      category: ErrorCategory.NOT_FOUND,
      retryable: false,
      userMessage: 'El recurso solicitado no fue encontrado.',
      technicalMessage: `Not found: ${error.message}`,
      statusCode: 404,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // Conflict errors (including optimistic locking)
  if (error?.statusCode === 409 || error?.code === 'CONFLICT' || error?.code === 'CONCURRENT_MODIFICATION' || error?.code === 'DUPLICATE_FEATURE_NAME') {
    return {
      category: ErrorCategory.CONFLICT,
      retryable: false, // Don't retry duplicate name errors
      userMessage: error?.message || 'The resource was modified by another user. Please refresh and try again.',
      technicalMessage: `Conflict error: ${error.message}`,
      statusCode: 409,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // Rate limit errors
  if (error?.statusCode === 429 || error?.code === 'RATE_LIMIT') {
    return {
      category: ErrorCategory.RATE_LIMIT,
      retryable: true,
      userMessage: 'Demasiadas solicitudes. Por favor, espere un momento e intente nuevamente.',
      technicalMessage: `Rate limit exceeded: ${error.message}`,
      statusCode: 429,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // Server errors
  if (error?.statusCode >= 500) {
    // Extract backend error message if available
    const backendMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message;
    const backendError = error?.response?.data;
    
    return {
      category: ErrorCategory.SERVER_ERROR,
      retryable: true,
      userMessage: backendMessage || 'Server error. Please try again later.',
      technicalMessage: `Server error (${error.statusCode}): ${error.message || backendMessage || 'Unknown error'}`,
      statusCode: error.statusCode,
      code: error?.code || error?.response?.data?.code,
      correlationId: error?.correlationId || error?.response?.data?.correlationId,
    };
  }

  // HttpClientError - handle directly to preserve statusCode
  if (error instanceof HttpClientError || error?.name === 'HttpClientError') {
    const statusCode = error.statusCode || error?.statusCode;
    const code = error.code || error?.code;
    const message = error.message || error?.message;
    
    // Handle server errors (500+)
    if (statusCode >= 500) {
      return {
        category: ErrorCategory.SERVER_ERROR,
        retryable: true,
        userMessage: message || 'Server error. Please try again later.',
        technicalMessage: `Server error (${statusCode}): ${message || 'Unknown error'}`,
        statusCode,
        code,
        correlationId: error.correlationId || error?.correlationId,
      };
    }
    
    // Handle other HTTP errors by recursing with proper structure
    return categorizeError({
      statusCode,
      code,
      message,
      correlationId: error.correlationId || error?.correlationId,
      isNetworkError: error.isNetworkError || error?.isNetworkError,
      isTimeout: error.isTimeout || error?.isTimeout,
      response: error.response || error?.response,
    });
  }

  // Unknown error
  return {
    category: ErrorCategory.UNKNOWN,
    retryable: false,
    userMessage: 'Ocurrió un error inesperado. Por favor, intente nuevamente.',
    technicalMessage: `Unknown error: ${error?.message || String(error)}`,
    statusCode: error?.statusCode,
    code: error?.code,
    correlationId: error?.correlationId,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: any): string {
  return categorizeError(error).userMessage;
}

/**
 * Check if error is retryable
 */
export function isErrorRetryable(error: any): boolean {
  return categorizeError(error).retryable;
}

