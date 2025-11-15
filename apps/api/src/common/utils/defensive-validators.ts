/**
 * Defensive Programming Validators
 * 
 * Utility functions for defensive programming practices
 * Validates inputs before operations to prevent errors and security issues
 */

import { BadRequestException } from '@nestjs/common';

/**
 * Validates that a string is not null, undefined, or empty
 */
export function validateString(
  value: string | null | undefined,
  fieldName: string,
): asserts value is string {
  if (value === null || value === undefined) {
    throw new BadRequestException(`${fieldName} is required`);
  }
  if (typeof value !== 'string') {
    throw new BadRequestException(`${fieldName} must be a string`);
  }
  if (value.trim().length === 0) {
    throw new BadRequestException(`${fieldName} cannot be empty`);
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
    throw new BadRequestException(`${resourceName} ID is required`);
  }
  if (typeof id !== 'string') {
    throw new BadRequestException(`${resourceName} ID must be a string`);
  }
  if (id.trim().length === 0) {
    throw new BadRequestException(`${resourceName} ID cannot be empty`);
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
    throw new BadRequestException(`${objectName} is required`);
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
    throw new BadRequestException(`${arrayName} is required`);
  }
  if (!Array.isArray(arr)) {
    throw new BadRequestException(`${arrayName} must be an array`);
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
    throw new BadRequestException(`${fieldName} is required`);
  }
  if (typeof value !== 'number' || isNaN(value)) {
    throw new BadRequestException(`${fieldName} must be a valid number`);
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
    throw new BadRequestException(`${fieldName} must be a valid date`);
  }
}

/**
 * Validates that a user object has required fields
 */
export function validateUserObject(user: any, operation: string): void {
  validateObject(user, 'User');
  if (!user.id) {
    throw new BadRequestException(`User ID is required for ${operation}`);
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
    throw new BadRequestException('Password cannot be empty');
  }
}

/**
 * Validates that an email format is valid (basic check)
 */
export function validateEmailFormat(email: string): void {
  validateString(email, 'Email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestException('Invalid email format');
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
    throw new BadRequestException(
      `${fieldName} must be between ${min} and ${max}`,
    );
  }
}

