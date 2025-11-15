/**
 * NestJS Adapters for Defensive Validators
 *
 * Wraps framework-agnostic validators to throw NestJS-specific exceptions
 *
 * Note: This module requires @nestjs/common as a peer dependency
 * Only import this when using in NestJS context
 */

// Dynamic import to avoid requiring @nestjs/common in non-NestJS contexts
let BadRequestException: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  BadRequestException = require('@nestjs/common').BadRequestException;
} catch {
  // Fallback if @nestjs/common is not available
  BadRequestException = class BadRequestException extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'BadRequestException';
    }
  };
}

import {
  validateString as coreValidateString,
  validateId as coreValidateId,
  validateObject as coreValidateObject,
  validateArray as coreValidateArray,
  validateNumber as coreValidateNumber,
  validateDateString as coreValidateDateString,
  validatePassword as coreValidatePassword,
  validateEmailFormat as coreValidateEmailFormat,
  validateRange as coreValidateRange,
  ValidationError,
} from './defensive-validators.js';

/**
 * Wraps validation errors to throw NestJS BadRequestException
 */
function wrapNestJSException<T extends (...args: any[]) => any>(
  validator: T,
): T {
  return ((...args: Parameters<T>) => {
    try {
      return validator(...args);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        // TypeScript narrows error to ValidationError here
        const validationError = error as ValidationError;
        throw new BadRequestException(validationError.message);
      }
      // Re-throw unknown errors as-is
      throw error;
    }
  }) as T;
}

/**
 * Validates that a string is not null, undefined, or empty
 * Throws NestJS BadRequestException on validation failure
 */
export const validateString = wrapNestJSException(coreValidateString);

/**
 * Validates that a string ID is valid (not null, undefined, or empty)
 * Throws NestJS BadRequestException on validation failure
 */
export const validateId = wrapNestJSException(coreValidateId);

/**
 * Validates that an object is not null or undefined
 * Throws NestJS BadRequestException on validation failure
 */
export const validateObject = wrapNestJSException(coreValidateObject);

/**
 * Validates that an array is not null or undefined (but can be empty)
 * Throws NestJS BadRequestException on validation failure
 */
export const validateArray = wrapNestJSException(coreValidateArray);

/**
 * Validates that a number is valid (not null, undefined, or NaN)
 * Throws NestJS BadRequestException on validation failure
 */
export const validateNumber = wrapNestJSException(coreValidateNumber);

/**
 * Validates that a date string is valid
 * Throws NestJS BadRequestException on validation failure
 */
export const validateDateString = wrapNestJSException(coreValidateDateString);

/**
 * Validates that a password is not empty (but doesn't check strength)
 * Throws NestJS BadRequestException on validation failure
 */
export const validatePassword = wrapNestJSException(coreValidatePassword);

/**
 * Validates that an email format is valid (basic check)
 * Throws NestJS BadRequestException on validation failure
 */
export const validateEmailFormat = wrapNestJSException(coreValidateEmailFormat);

/**
 * Validates that a value is within a range (for numbers)
 * Throws NestJS BadRequestException on validation failure
 */
export const validateRange = wrapNestJSException(coreValidateRange);

