/**
 * Logger Service
 * 
 * Structured logging service for the application
 */
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService implements NestLoggerService {
  private readonly logger: Logger;

  constructor(context?: string) {
    this.logger = new Logger(context || 'Application');
  }

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }

  /**
   * Log database operations
   */
  logDatabase(operation: string, entity: string, details?: any) {
    this.logger.log(
      JSON.stringify({
        type: 'database',
        operation,
        entity,
        ...details,
      }),
      'Database',
    );
  }

  /**
   * Log API requests
   */
  logRequest(method: string, path: string, statusCode: number, duration: number) {
    this.logger.log(
      JSON.stringify({
        type: 'request',
        method,
        path,
        statusCode,
        duration,
      }),
      'HTTP',
    );
  }

  /**
   * Log errors with context
   */
  logError(error: Error, context?: string, metadata?: any) {
    this.logger.error(
      JSON.stringify({
        type: 'error',
        message: error.message,
        stack: error.stack,
        ...metadata,
      }),
      error.stack,
      context,
    );
  }
}

