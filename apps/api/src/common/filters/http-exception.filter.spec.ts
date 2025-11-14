/**
 * HTTP Exception Filter Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import {
  HttpException,
  HttpStatus,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DatabaseException } from '../exceptions/database-exception';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: ArgumentsHost;
  let loggerErrorSpy: jest.SpyInstance;
  let loggerWarnSpy: jest.SpyInstance;
  const originalEnv = process.env;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    mockRequest = {
      method: 'GET',
      url: '/api/test',
      correlationId: 'correlation-123',
      requestId: 'request-456',
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => mockRequest),
        getResponse: jest.fn(() => mockResponse),
      })),
    } as any;

    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  describe('catch', () => {
    it('should handle HttpException', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Test error',
          correlationId: 'correlation-123',
          requestId: 'request-456',
        }),
      );
    });

    it('should handle DatabaseException', () => {
      const exception = new DatabaseException('DB error', HttpStatus.INTERNAL_SERVER_ERROR, 'DB_ERROR');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'DB_ERROR',
          correlationId: 'correlation-123',
          requestId: 'request-456',
        }),
      );
    });

    it('should handle QueryFailedError', () => {
      const typeOrmError = new QueryFailedError('SELECT * FROM users', [], { code: '23505' });
      const exception = DatabaseException.fromTypeORMError(typeOrmError);

      filter.catch(typeOrmError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle unknown exceptions', () => {
      const exception = new Error('Unknown error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        }),
      );
    });

    it('should include stack trace in development mode', () => {
      process.env.NODE_ENV = 'development';
      const exception = new Error('Test error');
      exception.stack = 'Error stack trace';

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: 'Error stack trace',
        }),
      );
    });

    it('should hide stack trace in production mode', () => {
      process.env.NODE_ENV = 'production';
      const exception = new Error('Test error');
      exception.stack = 'Error stack trace';

      filter.catch(exception, mockArgumentsHost);

      const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(callArgs.stack).toBeUndefined();
      expect(callArgs.message).toBe('An internal server error occurred');
    });

    it('should use default correlationId and requestId when not present', () => {
      mockRequest.correlationId = undefined;
      mockRequest.requestId = undefined;
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          correlationId: 'unknown',
          requestId: 'unknown',
        }),
      );
    });

    it('should log errors with status >= 500', () => {
      const exception = new Error('Server error');
      exception.stack = 'Stack trace';

      filter.catch(exception, mockArgumentsHost);

      expect(loggerErrorSpy).toHaveBeenCalled();
    });

    it('should log warnings for errors with status < 500', () => {
      const exception = new HttpException('Client error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(loggerWarnSpy).toHaveBeenCalled();
      expect(loggerErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        { message: 'Validation failed', errors: ['field1', 'field2'] },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: ['field1', 'field2'],
        }),
      );
    });

    it('should handle DatabaseException with string response', () => {
      process.env.NODE_ENV = 'development'; // Set to development to avoid message override
      const exception = new DatabaseException('DB connection failed', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'DB connection failed',
        }),
      );
    });

    it('should include error code when present', () => {
      const exception = new DatabaseException('DB error', HttpStatus.CONFLICT, 'UNIQUE_VIOLATION');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'UNIQUE_VIOLATION',
        }),
      );
    });

    it('should include request details in response', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/test',
          method: 'GET',
          timestamp: expect.any(String),
        }),
      );
    });
  });
});
