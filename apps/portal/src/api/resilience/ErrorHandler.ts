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

  // Validation errors
  if (error?.statusCode === 400 || error?.code === 'VALIDATION_ERROR') {
    return {
      category: ErrorCategory.VALIDATION,
      retryable: false,
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
  if (error?.statusCode === 409 || error?.code === 'CONFLICT' || error?.code === 'CONCURRENT_MODIFICATION') {
    return {
      category: ErrorCategory.CONFLICT,
      retryable: true,
      userMessage: error?.message || 'El recurso fue modificado por otro usuario. Por favor, recargue y vuelva a intentar.',
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
    return {
      category: ErrorCategory.SERVER_ERROR,
      retryable: true,
      userMessage: 'Error del servidor. Por favor, intente más tarde.',
      technicalMessage: `Server error: ${error.message}`,
      statusCode: error?.statusCode,
      code: error?.code,
      correlationId: error?.correlationId,
    };
  }

  // HttpClientError
  if (error instanceof HttpClientError) {
    return categorizeError({
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      correlationId: error.correlationId,
      isNetworkError: error.isNetworkError,
      isTimeout: error.isTimeout,
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

