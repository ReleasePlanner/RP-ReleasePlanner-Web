import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getErrorMessage,
  getErrorTitle,
  logError,
  getErrorDetails,
} from './errorNotification';
import { HttpClientError } from '../../api/httpClient';
import { logger } from '../logging/Logger';

vi.mock('../logging/Logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('errorNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  describe('getErrorMessage', () => {
    it('should return offline message when device is offline', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        configurable: true,
        value: false,
      });

      const error = new HttpClientError(
        'Network error',
        0,
        'NETWORK_ERROR',
        'OFFLINE',
        'corr-123',
        undefined,
        true,
      );

      const message = getErrorMessage(error);
      expect(message).toContain('No hay conexión a internet');
    });

    it('should return network error message for network errors', () => {
      const error = new HttpClientError(
        'Network error',
        0,
        'NETWORK_ERROR',
        'NETWORK_ERROR',
        'corr-123',
        undefined,
        true,
      );

      const message = getErrorMessage(error);
      expect(message).toContain('Error de conexión');
    });

    it('should return timeout message for timeout errors', () => {
      const error = new HttpClientError(
        'Timeout',
        408,
        'TIMEOUT',
        'REQUEST_TIMEOUT',
        'corr-123',
        undefined,
        false,
        true,
      );

      const message = getErrorMessage(error);
      expect(message).toContain('tardó demasiado tiempo');
    });

    it('should return appropriate message for 400 status', () => {
      const error = new HttpClientError('Bad Request', 400);
      const message = getErrorMessage(error);
      expect(message).toContain('Solicitud inválida');
    });

    it('should return appropriate message for 401 status', () => {
      const error = new HttpClientError('Unauthorized', 401);
      const message = getErrorMessage(error);
      expect(message).toContain('No autorizado');
    });

    it('should return appropriate message for 403 status', () => {
      const error = new HttpClientError('Forbidden', 403);
      const message = getErrorMessage(error);
      expect(message).toContain('No tienes permisos');
    });

    it('should return appropriate message for 404 status', () => {
      const error = new HttpClientError('Not Found', 404);
      const message = getErrorMessage(error);
      expect(message).toContain('no encontrado');
    });

    it('should return appropriate message for 409 status', () => {
      const error = new HttpClientError('Conflict', 409);
      const message = getErrorMessage(error);
      expect(message).toContain('Conflicto');
    });

    it('should return appropriate message for 429 status', () => {
      const error = new HttpClientError('Too Many Requests', 429);
      const message = getErrorMessage(error);
      expect(message).toContain('Demasiadas solicitudes');
    });

    it('should return appropriate message for 500 status', () => {
      const error = new HttpClientError('Internal Server Error', 500);
      const message = getErrorMessage(error);
      expect(message).toContain('Error del servidor');
    });

    it('should return appropriate message for 502 status', () => {
      const error = new HttpClientError('Bad Gateway', 502);
      const message = getErrorMessage(error);
      expect(message).toContain('no está disponible');
    });

    it('should return appropriate message for 503 status', () => {
      const error = new HttpClientError('Service Unavailable', 503);
      const message = getErrorMessage(error);
      expect(message).toContain('no está disponible');
    });

    it('should return appropriate message for 504 status', () => {
      const error = new HttpClientError('Gateway Timeout', 504);
      const message = getErrorMessage(error);
      expect(message).toContain('no está disponible');
    });

    it('should return generic message for unknown status codes', () => {
      const error = new HttpClientError('Unknown Error', 418);
      const message = getErrorMessage(error);
      expect(message).toContain('error inesperado');
    });

    it('should return message from Error instance', () => {
      const error = new Error('Custom error message');
      const message = getErrorMessage(error);
      expect(message).toBe('Custom error message');
    });

    it('should return generic message for unknown error types', () => {
      const error = 'String error';
      const message = getErrorMessage(error);
      expect(message).toContain('error inesperado');
    });
  });

  describe('getErrorTitle', () => {
    it('should return network error title for network errors', () => {
      const error = new HttpClientError('Network error', 0, 'NETWORK_ERROR', 'NETWORK_ERROR', 'corr-123', undefined, true);
      const title = getErrorTitle(error);
      expect(title).toBe('Error de Conexión');
    });

    it('should return timeout title for timeout errors', () => {
      const error = new HttpClientError('Timeout', 408, 'TIMEOUT', 'REQUEST_TIMEOUT', 'corr-123', undefined, false, true);
      const title = getErrorTitle(error);
      expect(title).toBe('Tiempo de Espera Agotado');
    });

    it('should return server error title for 5xx errors', () => {
      const error = new HttpClientError('Server Error', 500);
      const title = getErrorTitle(error);
      expect(title).toBe('Error del Servidor');
    });

    it('should return not found title for 404', () => {
      const error = new HttpClientError('Not Found', 404);
      const title = getErrorTitle(error);
      expect(title).toBe('No Encontrado');
    });

    it('should return access denied title for 403', () => {
      const error = new HttpClientError('Forbidden', 403);
      const title = getErrorTitle(error);
      expect(title).toBe('Acceso Denegado');
    });

    it('should return unauthorized title for 401', () => {
      const error = new HttpClientError('Unauthorized', 401);
      const title = getErrorTitle(error);
      expect(title).toBe('No Autorizado');
    });

    it('should return generic error title for other errors', () => {
      const error = new Error('Some error');
      const title = getErrorTitle(error);
      expect(title).toBe('Error');
    });
  });

  describe('logError', () => {
    it('should log error with context', () => {
      const error = new HttpClientError('Test error', 500);
      const context = { component: 'TestComponent', action: 'testAction' };

      logError(error, context);

      expect(logger.error).toHaveBeenCalledWith(
        'User-facing error',
        error,
        expect.objectContaining({
          component: 'errorNotification',
          action: 'logError',
          metadata: expect.objectContaining({
            errorTitle: 'Error del Servidor',
            errorMessage: expect.any(String),
            ...context,
          }),
        }),
      );
    });
  });

  describe('getErrorDetails', () => {
    it('should return details for HttpClientError', () => {
      const error = new HttpClientError(
        'Test error',
        500,
        'TEST_CODE',
        'TEST_CODE',
        'corr-123',
        'req-456',
      );

      const details = getErrorDetails(error);
      expect(details).toContain('corr-123');
      expect(details).toContain('req-456');
      expect(details).toContain('TEST_CODE');
      expect(details).toContain('500');
    });

    it('should return stack trace for Error instance', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';

      const details = getErrorDetails(error);
      expect(details).toBe('Error: Test error\n    at test.js:1:1');
    });

    it('should return empty string for unknown error types', () => {
      const error = 'String error';
      const details = getErrorDetails(error);
      expect(details).toBe('');
    });
  });
});

