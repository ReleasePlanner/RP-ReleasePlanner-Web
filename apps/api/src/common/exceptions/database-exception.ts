/**
 * Database Exception
 * 
 * Custom exceptions for database-related errors
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export class DatabaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly code?: string,
    public readonly originalError?: Error,
  ) {
    super(
      {
        message,
        code,
        statusCode,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }

  /**
   * Convert TypeORM QueryFailedError to DatabaseException
   */
  static fromTypeORMError(error: QueryFailedError): DatabaseException {
    const message = error.message;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'DATABASE_ERROR';

    // Handle specific PostgreSQL error codes
    if (error.driverError) {
      const pgError = error.driverError as { code?: string };
      
      switch (pgError.code) {
        case '23505': // Unique violation
          statusCode = HttpStatus.CONFLICT;
          code = 'UNIQUE_VIOLATION';
          break;
        case '23503': // Foreign key violation
          statusCode = HttpStatus.BAD_REQUEST;
          code = 'FOREIGN_KEY_VIOLATION';
          break;
        case '23502': // Not null violation
          statusCode = HttpStatus.BAD_REQUEST;
          code = 'NOT_NULL_VIOLATION';
          break;
        case '23514': // Check violation
          statusCode = HttpStatus.BAD_REQUEST;
          code = 'CHECK_VIOLATION';
          break;
        case '42P01': // Undefined table
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          code = 'UNDEFINED_TABLE';
          break;
        case '42703': // Undefined column
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          code = 'UNDEFINED_COLUMN';
          break;
        case '08003': // Connection does not exist
        case '08006': // Connection failure
          statusCode = HttpStatus.SERVICE_UNAVAILABLE;
          code = 'CONNECTION_ERROR';
          break;
        case '53300': // Too many connections
          statusCode = HttpStatus.SERVICE_UNAVAILABLE;
          code = 'TOO_MANY_CONNECTIONS';
          break;
        default:
          code = 'DATABASE_ERROR';
      }
    }

    return new DatabaseException(message, statusCode, code, error);
  }
}

