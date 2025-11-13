/**
 * Error Notification System
 * 
 * Provides user-friendly error notifications
 */
import { logger } from '../logging/Logger';
import { HttpClientError } from '../../api/httpClient';

export interface ErrorNotificationOptions {
  title?: string;
  message?: string;
  duration?: number;
  showDetails?: boolean;
}

/**
 * Get user-friendly error message based on error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpClientError) {
    // Network errors
    if (error.isNetworkError) {
      if (!navigator.onLine) {
        return 'No hay conexión a internet. Por favor, verifica tu conexión.';
      }
      return 'Error de conexión. Por favor, intenta nuevamente.';
    }

    // Timeout errors
    if (error.isTimeout) {
      return 'La solicitud tardó demasiado tiempo. Por favor, intenta nuevamente.';
    }

    // HTTP status code errors
    switch (error.statusCode) {
      case 400:
        return error.message || 'Solicitud inválida. Por favor, verifica los datos ingresados.';
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return error.message || 'Conflicto: El recurso ya existe o ha sido modificado.';
      case 429:
        return 'Demasiadas solicitudes. Por favor, espera un momento e intenta nuevamente.';
      case 500:
        return 'Error del servidor. Por favor, intenta más tarde.';
      case 502:
      case 503:
      case 504:
        return 'El servicio no está disponible temporalmente. Por favor, intenta más tarde.';
      default:
        return error.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
    }
  }

  if (error instanceof Error) {
    return error.message || 'Ocurrió un error inesperado.';
  }

  return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
}

/**
 * Get error title based on error type
 */
export function getErrorTitle(error: unknown): string {
  if (error instanceof HttpClientError) {
    if (error.isNetworkError) {
      return 'Error de Conexión';
    }
    if (error.isTimeout) {
      return 'Tiempo de Espera Agotado';
    }
    if (error.statusCode >= 500) {
      return 'Error del Servidor';
    }
    if (error.statusCode === 404) {
      return 'No Encontrado';
    }
    if (error.statusCode === 403) {
      return 'Acceso Denegado';
    }
    if (error.statusCode === 401) {
      return 'No Autorizado';
    }
  }

  return 'Error';
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

