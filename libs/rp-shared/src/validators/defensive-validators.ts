/**
 * Defensive Programming Validators
 *
 * Utility functions for defensive programming practices
 * Validates inputs before operations to prevent errors and security issues
 *
 * Framework-agnostic validators that throw generic Error.
 * Framework-specific adapters (NestJS, React) can wrap these.
 */

/**
 * Custom error for validation failures
 */
export class ValidationError extends Error {
  constructor(message: string, public fieldName?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates that a string is not null, undefined, or empty
 */
export function validateString(
  value: string | null | undefined,
  fieldName: string,
): asserts value is string {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }
  if (value.trim().length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }
}

/**
 * Validates that a string ID is valid (not null, undefined, or empty)
 */
export function validateId(
  id: string | null | undefined,
  resourceName: string = 'Resource',
): asserts id is string {
  if (id === null || id === undefined) {
    throw new ValidationError(`${resourceName} ID is required`, resourceName);
  }
  if (typeof id !== 'string') {
    throw new ValidationError(`${resourceName} ID must be a string`, resourceName);
  }
  if (id.trim().length === 0) {
    throw new ValidationError(`${resourceName} ID cannot be empty`, resourceName);
  }
}

/**
 * Validates that an object is not null or undefined
 */
export function validateObject<T>(
  obj: T | null | undefined,
  objectName: string,
): asserts obj is T {
  if (obj === null || obj === undefined) {
    throw new ValidationError(`${objectName} is required`, objectName);
  }
}

/**
 * Validates that an array is not null or undefined (but can be empty)
 */
export function validateArray<T>(
  arr: T[] | null | undefined,
  arrayName: string,
): asserts arr is T[] {
  if (arr === null || arr === undefined) {
    throw new ValidationError(`${arrayName} is required`, arrayName);
  }
  if (!Array.isArray(arr)) {
    throw new ValidationError(`${arrayName} must be an array`, arrayName);
  }
}

/**
 * Validates that a number is valid (not null, undefined, or NaN)
 */
export function validateNumber(
  value: number | null | undefined,
  fieldName: string,
): asserts value is number {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`, fieldName);
  }
}

/**
 * Validates that a date string is valid
 */
export function validateDateString(
  dateString: string | null | undefined,
  fieldName: string,
): asserts dateString is string {
  validateString(dateString, fieldName);
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`, fieldName);
  }
}

/**
 * Validates that a password is not empty (but doesn't check strength)
 */
export function validatePassword(
  password: string | null | undefined,
): asserts password is string {
  validateString(password, 'Password');
  if (password.length < 1) {
    throw new ValidationError('Password cannot be empty', 'Password');
  }
}

/**
 * Validates that an email format is valid (basic check)
 */
export function validateEmailFormat(email: string): void {
  validateString(email, 'Email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'Email');
  }
}

/**
 * Validates that a value is within a range (for numbers)
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string,
): void {
  validateNumber(value, fieldName);
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      fieldName,
    );
  }
}

/**
 * Safely trims a string, returning empty string if null/undefined
 */
export function safeTrim(value: string | null | undefined): string {
  return value?.trim() || '';
}

/**
 * Safely checks if a string is not empty after trimming
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

