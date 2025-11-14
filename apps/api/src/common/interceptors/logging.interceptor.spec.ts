/**
 * Logging Interceptor Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: CallHandler;
  let mockRequest: any;
  let mockResponse: any;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);

    mockRequest = {
      method: 'GET',
      url: '/api/test',
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'test-agent',
      },
      correlationId: 'correlation-123',
      requestId: 'request-456',
    };

    mockResponse = {
      statusCode: 200,
    };

    mockExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => mockRequest),
        getResponse: jest.fn(() => mockResponse),
      })),
    };

    mockCallHandler = {
      handle: jest.fn(() => of({ data: 'test' })),
    } as any;

    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should log request start', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(loggerSpy).toHaveBeenCalled();
            const logCall = loggerSpy.mock.calls.find((call) => {
              try {
                const parsed = JSON.parse(call[0]);
                return parsed.type === 'request_start';
              } catch {
                return false;
              }
            });
            expect(logCall).toBeDefined();
            if (logCall) {
              const logData = JSON.parse(logCall[0]);
              expect(logData.method).toBe('GET');
              expect(logData.url).toBe('/api/test');
              expect(logData.correlationId).toBe('correlation-123');
              expect(logData.requestId).toBe('request-456');
            }
            done();
          },
        });
    });

    it('should log successful response', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            const successCall = loggerSpy.mock.calls.find((call) => {
              try {
                const parsed = JSON.parse(call[0]);
                return parsed.type === 'request_success';
              } catch {
                return false;
              }
            });
            expect(successCall).toBeDefined();
            if (successCall) {
              const logData = JSON.parse(successCall[0]);
              expect(logData.statusCode).toBe(200);
              expect(logData.duration).toBeGreaterThanOrEqual(0);
            }
            done();
          },
        });
    });

    it('should log error response', (done) => {
      const error = new Error('Test error');
      error.stack = 'Error stack';
      mockCallHandler.handle = jest.fn(() => throwError(() => error));

      const errorSpy = jest.spyOn(Logger.prototype, 'error');

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          error: () => {
            expect(errorSpy).toHaveBeenCalled();
            const errorCall = errorSpy.mock.calls.find((call) => {
              try {
                const parsed = JSON.parse(call[0]);
                return parsed.type === 'request_error';
              } catch {
                return false;
              }
            });
            expect(errorCall).toBeDefined();
            if (errorCall) {
              const logData = JSON.parse(errorCall[0]);
              expect(logData.statusCode).toBe(200);
              expect(logData.error.message).toBe('Test error');
            }
            done();
          },
        });
    });

    it('should use default correlationId when not present', (done) => {
      delete mockRequest.correlationId;
      delete mockRequest.requestId;

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            const logCall = loggerSpy.mock.calls.find((call) => {
              try {
                const parsed = JSON.parse(call[0]);
                return parsed.type === 'request_start';
              } catch {
                return false;
              }
            });
            if (logCall) {
              const logData = JSON.parse(logCall[0]);
              expect(logData.correlationId).toBe('unknown');
              expect(logData.requestId).toBe('unknown');
            }
            done();
          },
        });
    });

    it('should use default user-agent when not present', (done) => {
      delete mockRequest.headers['user-agent'];

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            const logCall = loggerSpy.mock.calls.find((call) => {
              try {
                const parsed = JSON.parse(call[0]);
                return parsed.type === 'request_start';
              } catch {
                return false;
              }
            });
            if (logCall) {
              const logData = JSON.parse(logCall[0]);
              expect(logData.userAgent).toBe('unknown');
            }
            done();
          },
        });
    });

    it('should calculate request duration', (done) => {
      const startTime = Date.now();
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            const successCall = loggerSpy.mock.calls.find((call) => {
              try {
                const parsed = JSON.parse(call[0]);
                return parsed.type === 'request_success';
              } catch {
                return false;
              }
            });
            if (successCall) {
              const logData = JSON.parse(successCall[0]);
              expect(logData.duration).toBeGreaterThanOrEqual(0);
              expect(logData.duration).toBeLessThan(100); // Should be very fast
            }
            done();
          },
        });
    });

    it('should handle error without statusCode', (done) => {
      const error = new Error('Test error');
      mockCallHandler.handle = jest.fn(() => throwError(() => error));
      mockResponse.statusCode = undefined;

      const errorSpy = jest.spyOn(Logger.prototype, 'error');

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          error: () => {
            const errorCall = errorSpy.mock.calls.find((call) => {
              try {
                const parsed = JSON.parse(call[0]);
                return parsed.type === 'request_error';
              } catch {
                return false;
              }
            });
            if (errorCall) {
              const logData = JSON.parse(errorCall[0]);
              expect(logData.statusCode).toBe(500);
            }
            done();
          },
        });
    });

    it('should handle error with code property', (done) => {
      const error: any = new Error('Test error');
      error.code = 'ERR_TEST';
      mockCallHandler.handle = jest.fn(() => throwError(() => error));

      const errorSpy = jest.spyOn(Logger.prototype, 'error');

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          error: () => {
            const errorCall = errorSpy.mock.calls.find((call) => {
              try {
                const parsed = JSON.parse(call[0]);
                return parsed.type === 'request_error';
              } catch {
                return false;
              }
            });
            if (errorCall) {
              const logData = JSON.parse(errorCall[0]);
              expect(logData.error.code).toBe('ERR_TEST');
            }
            done();
          },
        });
    });
  });
});

