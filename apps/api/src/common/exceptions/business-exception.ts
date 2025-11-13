/**
 * Business Exception
 * 
 * Custom exception for business rule violations
 */
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly code?: string,
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
}

export class NotFoundException extends BusinessException {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    super(message, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND');
  }
}

export class ConflictException extends BusinessException {
  constructor(message: string, code?: string) {
    super(message, HttpStatus.CONFLICT, code || 'RESOURCE_CONFLICT');
  }
}

export class ValidationException extends BusinessException {
  constructor(message: string, field?: string) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      field ? `VALIDATION_ERROR_${field.toUpperCase()}` : 'VALIDATION_ERROR',
    );
  }
}

