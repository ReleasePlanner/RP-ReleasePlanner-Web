/**
 * Timeout Interceptor Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { TimeoutInterceptor } from './timeout.interceptor';
import { ExecutionContext, CallHandler, RequestTimeoutException, Logger } from '@nestjs/common';
import { of, throwError, TimeoutError } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('TimeoutInterceptor', () => {
  let interceptor: TimeoutInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: CallHandler;
  let mockRequest: any;
  let loggerSpy: jest.SpyInstance;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };

    // Create instance directly since constructor has optional parameter
    interceptor = new TimeoutInterceptor();

    mockRequest = {
      method: 'GET',
      url: '/api/test',
    };

    mockExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => mockRequest),
      })),
    };

    mockCallHandler = {
      handle: jest.fn(() => of({ data: 'test' })),
    } as any;

    loggerSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  describe('constructor', () => {
    beforeEach(() => {
      delete process.env.REQUEST_TIMEOUT_MS;
    });

    it('should use default timeout of 30000ms', () => {
      const defaultInterceptor = new TimeoutInterceptor();
      expect((defaultInterceptor as any).defaultTimeout).toBe(30000);
    });

    it('should use custom timeout when provided', () => {
      delete process.env.REQUEST_TIMEOUT_MS;
      const customInterceptor = new TimeoutInterceptor(5000);
      expect((customInterceptor as any).defaultTimeout).toBe(5000);
    });

    it('should use REQUEST_TIMEOUT_MS environment variable', () => {
      process.env.REQUEST_TIMEOUT_MS = '15000';
      const envInterceptor = new TimeoutInterceptor();
      expect((envInterceptor as any).defaultTimeout).toBe(15000);
    });

    it('should use constructor parameter when env var is not set', () => {
      delete process.env.REQUEST_TIMEOUT_MS;
      const customInterceptor = new TimeoutInterceptor(20000);
      expect((customInterceptor as any).defaultTimeout).toBe(20000);
    });

    it('should prioritize env var over constructor parameter', () => {
      process.env.REQUEST_TIMEOUT_MS = '25000';
      const customInterceptor = new TimeoutInterceptor(20000);
      expect((customInterceptor as any).defaultTimeout).toBe(25000);
    });
  });

  describe('intercept', () => {
    it('should allow request that completes within timeout', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          next: (data) => {
            expect(data).toEqual({ data: 'test' });
            done();
          },
        });
    });

    it('should throw RequestTimeoutException when timeout is exceeded', (done) => {
      const fastInterceptor = new TimeoutInterceptor(10); // 10ms timeout
      mockCallHandler.handle = jest.fn(() => of({ data: 'test' }).pipe(delay(100))); // 100ms delay

      fastInterceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(RequestTimeoutException);
          expect(error.message).toContain('Request timeout');
          expect(error.message).toContain('10ms');
          expect(loggerSpy).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should log warning on timeout', (done) => {
      const fastInterceptor = new TimeoutInterceptor(10);
      mockCallHandler.handle = jest.fn(() => of({ data: 'test' }).pipe(delay(100)));

      fastInterceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler).subscribe({
        error: () => {
          expect(loggerSpy).toHaveBeenCalledWith(
            'Request timeout: GET /api/test (exceeded 10ms)',
          );
          done();
        },
      });
    });

    it('should rethrow non-timeout errors', (done) => {
      const testError = new Error('Test error');
      mockCallHandler.handle = jest.fn(() => throwError(() => testError));

      interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBe(testError);
          expect(error).not.toBeInstanceOf(RequestTimeoutException);
          done();
        },
      });
    });

    it('should call next.handle()', () => {
      interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler).subscribe();

      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('should handle TimeoutError correctly', (done) => {
      const fastInterceptor = new TimeoutInterceptor(10);
      mockCallHandler.handle = jest.fn(() => {
        return of({ data: 'test' }).pipe(delay(100));
      });

      fastInterceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(RequestTimeoutException);
          done();
        },
      });
    });
  });
});

