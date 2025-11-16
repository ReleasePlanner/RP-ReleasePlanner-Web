/**
 * Error Notification System
 * 
 * Provides user-friendly error notifications
 * 
 * NOTE: This module now uses the centralized ErrorHandler for consistency.
 * All error messages are provided by the resilience ErrorHandler module.
 */
import { logger } from '../logging/Logger';
import { HttpClientError } from '../../api/httpClient';
import { getUserErrorMessage, categorizeError, ErrorCategory } from '../../api/resilience/ErrorHandler';

export interface ErrorNotificationOptions {
  title?: string;
  message?: string;
  duration?: number;
  showDetails?: boolean;
}

/**
 * Get user-friendly error message based on error type
 * 
 * Uses centralized ErrorHandler for consistency across the application
 */
export function getErrorMessage(error: unknown): string {
  // Use centralized error handler for all errors
  const errorContext = categorizeError(error);
  
  // Special handling for offline network errors
  if (
    errorContext.category === ErrorCategory.NETWORK &&
    typeof navigator !== 'undefined' &&
    !navigator.onLine
  ) {
    return 'No hay conexión a internet. Por favor, verifica tu conexión.';
  }
  
  return errorContext.userMessage;
}

/**
 * Get error title based on error type
 * 
 * Uses centralized ErrorHandler for consistency
 */
export function getErrorTitle(error: unknown): string {
  const errorContext = categorizeError(error);
  
  const titleMap: Record<ErrorCategory, string> = {
    [ErrorCategory.NETWORK]: 'Error de Conexión',
    [ErrorCategory.TIMEOUT]: 'Tiempo de Espera Agotado',
    [ErrorCategory.AUTHENTICATION]: 'No Autorizado',
    [ErrorCategory.AUTHORIZATION]: 'Acceso Denegado',
    [ErrorCategory.VALIDATION]: 'Error de Validación',
    [ErrorCategory.NOT_FOUND]: 'No Encontrado',
    [ErrorCategory.CONFLICT]: 'Conflicto',
    [ErrorCategory.RATE_LIMIT]: 'Demasiadas Solicitudes',
    [ErrorCategory.SERVER_ERROR]: 'Error del Servidor',
    [ErrorCategory.CIRCUIT_BREAKER]: 'Servicio No Disponible',
    [ErrorCategory.BULKHEAD_REJECTED]: 'Demasiadas Solicitudes',
    [ErrorCategory.BULKHEAD_TIMEOUT]: 'Tiempo de Espera Agotado',
    [ErrorCategory.UNKNOWN]: 'Error',
  };
  
  return titleMap[errorContext.category] || 'Error';
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const errorMessage = getErrorMessage(error);
  const errorTitle = getErrorTitle(error);

  logger.error('User-facing error', error instanceof Error ? error : new Error(String(error)), {
    component: 'errorNotification',
    action: 'logError',
    metadata: {
      errorTitle,
      errorMessage,
      ...context,
      errorType: error instanceof HttpClientError ? 'HttpClientError' : 'Unknown',
      statusCode: error instanceof HttpClientError ? error.statusCode : undefined,
      correlationId: error instanceof HttpClientError ? error.correlationId : undefined,
    },
  });
}

/**
 * Format error details for display
 */
export function getErrorDetails(error: unknown): string {
  if (error instanceof HttpClientError) {
    const details: string[] = [];

    if (error.correlationId) {
      details.push(`ID de correlación: ${error.correlationId}`);
    }

    if (error.requestId) {
      details.push(`ID de solicitud: ${error.requestId}`);
    }

    if (error.code) {
      details.push(`Código: ${error.code}`);
    }

    if (error.statusCode) {
      details.push(`Código HTTP: ${error.statusCode}`);
    }

    return details.join('\n');
  }

  if (error instanceof Error && error.stack) {
    return error.stack;
  }

  return '';
}

