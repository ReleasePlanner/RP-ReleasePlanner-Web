/**
 * Business Exception
 * 
 * Custom exception for business rule violations
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES, FIELD_ERROR_CODES, ERROR_MESSAGES } from '../constants';

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
    const message = ERROR_MESSAGES.RESOURCE_NOT_FOUND(resource, id);
    super(message, HttpStatus.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}

export class ConflictException extends BusinessException {
  constructor(message: string, code?: string) {
    super(message, HttpStatus.CONFLICT, code || ERROR_CODES.RESOURCE_CONFLICT);
  }
}

export class ValidationException extends BusinessException {
  constructor(message: string, field?: string) {
    const errorCode = field
      ? (FIELD_ERROR_CODES[field.toUpperCase() as keyof typeof FIELD_ERROR_CODES] ||
          `VALIDATION_ERROR_${field.toUpperCase()}`)
      : ERROR_CODES.VALIDATION_ERROR;
    super(message, HttpStatus.BAD_REQUEST, errorCode);
  }
}

