/**
 * Global Exception Filter
 * 
 * Handles all HTTP exceptions and formats responses consistently
 * with proper error logging and context
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DatabaseException } from '../exceptions/database-exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = (request as any).correlationId || 'unknown';
    const requestId = (request as any).requestId || 'unknown';

    let status: number;
    let message: string | object;
    let errorCode: string | undefined;

    // Handle different exception types
    if (exception instanceof DatabaseException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : exceptionResponse;
      errorCode = exception.code;
    } else if (exception instanceof QueryFailedError) {
      // Convert TypeORM errors to DatabaseException
      const dbException = DatabaseException.fromTypeORMError(exception);
      status = dbException.getStatus();
      const exceptionResponse = dbException.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : exceptionResponse;
      errorCode = dbException.code;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    // Format error response
    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      correlationId,
      requestId,
      message: typeof message === 'string' ? message : (message as { message?: string }).message,
      ...(typeof message === 'object' && message !== null ? message : {}),
    };

    if (errorCode) {
      errorResponse.code = errorCode;
    }

    // Don't expose internal errors in production
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      if (process.env.NODE_ENV === 'production') {
        errorResponse.message = 'An internal server error occurred';
        delete (errorResponse as any).stack;
      } else {
        // Include stack trace in development
        if (exception instanceof Error) {
          errorResponse.stack = exception.stack;
        }
      }
    }

    // Log error with structured logging
    const logData = {
      type: 'exception',
      method: request.method,
      url: request.url,
      statusCode: status,
      correlationId,
      requestId,
      error: {
        message: typeof message === 'string' ? message : (message as { message?: string }).message,
        code: errorCode,
        name: exception instanceof Error ? exception.name : 'Unknown',
      },
      timestamp: new Date().toISOString(),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        JSON.stringify(logData),
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else {
      this.logger.warn(JSON.stringify(logData));
    }

    response.status(status).json(errorResponse);
  }
}

