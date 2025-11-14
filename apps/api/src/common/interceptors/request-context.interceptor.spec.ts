/**
 * Request Context Interceptor Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { RequestContextInterceptor } from './request-context.interceptor';
import { ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('RequestContextInterceptor', () => {
  let interceptor: RequestContextInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: CallHandler;
  let mockRequest: any;
  let mockResponse: any;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestContextInterceptor],
    }).compile();

    interceptor = module.get<RequestContextInterceptor>(RequestContextInterceptor);

    mockRequest = {
      method: 'GET',
      url: '/api/test',
      headers: {},
    };

    mockResponse = {
      statusCode: 200,
      setHeader: jest.fn(),
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

    loggerSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should generate correlation ID when not present in headers', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(mockRequest.correlationId).toBe('mock-uuid');
            expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', 'mock-uuid');
            done();
          },
        });
    });

    it('should use correlation ID from headers when present', (done) => {
      mockRequest.headers['x-correlation-id'] = 'existing-correlation-id';

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(mockRequest.correlationId).toBe('existing-correlation-id');
            expect(mockResponse.setHeader).toHaveBeenCalledWith(
              'X-Correlation-ID',
              'existing-correlation-id',
            );
            done();
          },
        });
    });

    it('should generate request ID', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(mockRequest.requestId).toBe('mock-uuid');
            done();
          },
        });
    });

    it('should add user context when user is present', (done) => {
      mockRequest.user = {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
      };

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(mockRequest.userContext).toEqual({
              userId: 'user-id',
              username: 'testuser',
            });
            done();
          },
        });
    });

    it('should use user.sub when id is not present', (done) => {
      mockRequest.user = {
        sub: 'user-sub',
        username: 'testuser',
      };

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(mockRequest.userContext).toEqual({
              userId: 'user-sub',
              username: 'testuser',
            });
            done();
          },
        });
    });

    it('should use user.email when username is not present', (done) => {
      mockRequest.user = {
        id: 'user-id',
        email: 'test@example.com',
      };

      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(mockRequest.userContext).toEqual({
              userId: 'user-id',
              username: 'test@example.com',
            });
            done();
          },
        });
    });

    it('should not add user context when user is not present', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(mockRequest.userContext).toBeUndefined();
            done();
          },
        });
    });

    it('should log request completion', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(loggerSpy).toHaveBeenCalledWith(
              'Request completed: GET /api/test',
              {
                correlationId: 'mock-uuid',
                requestId: 'mock-uuid',
                method: 'GET',
                url: '/api/test',
                statusCode: 200,
              },
            );
            done();
          },
        });
    });

    it('should call next.handle()', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          complete: () => {
            expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
            done();
          },
        });
    });

    it('should return observable from next.handle()', (done) => {
      interceptor
        .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
        .subscribe({
          next: (data) => {
            expect(data).toEqual({ data: 'test' });
            done();
          },
        });
    });
  });
});

