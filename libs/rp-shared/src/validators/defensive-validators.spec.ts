/**
 * Tests for Defensive Validators
 */

import {
  validateString,
  validateId,
  validateObject,
  validateArray,
  validateNumber,
  validateDateString,
  validatePassword,
  validateEmailFormat,
  validateRange,
  safeTrim,
  isNotEmpty,
  ValidationError,
} from './defensive-validators';

describe('Defensive Validators', () => {
  describe('validateString', () => {
    it('should pass for valid string', () => {
      expect(() => validateString('test', 'Field')).not.toThrow();
    });

    it('should pass for string with content', () => {
      expect(() => validateString('hello world', 'Field')).not.toThrow();
    });

    it('should throw for null', () => {
      expect(() => validateString(null, 'Field')).toThrow(ValidationError);
      expect(() => validateString(null, 'Field')).toThrow('Field is required');
    });

    it('should throw for undefined', () => {
      expect(() => validateString(undefined, 'Field')).toThrow(ValidationError);
      expect(() => validateString(undefined, 'Field')).toThrow('Field is required');
    });

    it('should throw for empty string', () => {
      expect(() => validateString('', 'Field')).toThrow(ValidationError);
      expect(() => validateString('', 'Field')).toThrow('Field cannot be empty');
    });

    it('should throw for whitespace-only string', () => {
      expect(() => validateString('   ', 'Field')).toThrow(ValidationError);
      expect(() => validateString('\t\n', 'Field')).toThrow(ValidationError);
    });

    it('should throw for non-string types', () => {
      expect(() => validateString(123 as any, 'Field')).toThrow(ValidationError);
      expect(() => validateString({} as any, 'Field')).toThrow(ValidationError);
      expect(() => validateString([] as any, 'Field')).toThrow(ValidationError);
    });
  });

  describe('validateId', () => {
    it('should pass for valid ID', () => {
      expect(() => validateId('test-id', 'Resource')).not.toThrow();
    });

    it('should pass for UUID format', () => {
      expect(() => validateId('123e4567-e89b-12d3-a456-426614174000', 'Resource')).not.toThrow();
    });

    it('should use default resource name when not provided', () => {
      expect(() => validateId('test-id')).not.toThrow();
    });

    it('should throw for null', () => {
      expect(() => validateId(null, 'Resource')).toThrow(ValidationError);
      expect(() => validateId(null, 'Resource')).toThrow('Resource ID is required');
    });

    it('should throw for undefined', () => {
      expect(() => validateId(undefined, 'Resource')).toThrow(ValidationError);
    });

    it('should throw for empty string', () => {
      expect(() => validateId('', 'Resource')).toThrow(ValidationError);
      expect(() => validateId('   ', 'Resource')).toThrow(ValidationError);
    });

    it('should throw for non-string types', () => {
      expect(() => validateId(123 as any, 'Resource')).toThrow(ValidationError);
      expect(() => validateId({} as any, 'Resource')).toThrow(ValidationError);
    });
  });

  describe('validateObject', () => {
    it('should pass for valid object', () => {
      expect(() => validateObject({}, 'Object')).not.toThrow();
    });

    it('should throw for null', () => {
      expect(() => validateObject(null, 'Object')).toThrow(ValidationError);
    });

    it('should throw for undefined', () => {
      expect(() => validateObject(undefined, 'Object')).toThrow(ValidationError);
    });
  });

  describe('validateArray', () => {
    it('should pass for valid array', () => {
      expect(() => validateArray([], 'Array')).not.toThrow();
      expect(() => validateArray([1, 2, 3], 'Array')).not.toThrow();
    });

    it('should throw for null', () => {
      expect(() => validateArray(null, 'Array')).toThrow(ValidationError);
    });

    it('should throw for non-array', () => {
      expect(() => validateArray({} as any, 'Array')).toThrow(ValidationError);
    });
  });

  describe('validateNumber', () => {
    it('should pass for valid number', () => {
      expect(() => validateNumber(123, 'Number')).not.toThrow();
    });

    it('should throw for NaN', () => {
      expect(() => validateNumber(NaN, 'Number')).toThrow(ValidationError);
    });

    it('should throw for null', () => {
      expect(() => validateNumber(null, 'Number')).toThrow(ValidationError);
    });
  });

  describe('validateDateString', () => {
    it('should pass for valid date string (YYYY-MM-DD)', () => {
      expect(() => validateDateString('2024-01-01', 'Date')).not.toThrow();
    });

    it('should pass for ISO date string', () => {
      expect(() => validateDateString('2024-01-01T00:00:00.000Z', 'Date')).not.toThrow();
    });

    it('should pass for date with time', () => {
      expect(() => validateDateString('2024-12-31T23:59:59', 'Date')).not.toThrow();
    });

    it('should throw for invalid date string', () => {
      expect(() => validateDateString('invalid-date', 'Date')).toThrow(ValidationError);
      expect(() => validateDateString('2024-13-45', 'Date')).toThrow(ValidationError);
    });

    it('should throw for null', () => {
      expect(() => validateDateString(null, 'Date')).toThrow(ValidationError);
    });

    it('should throw for empty string', () => {
      expect(() => validateDateString('', 'Date')).toThrow(ValidationError);
    });
  });

  describe('validatePassword', () => {
    it('should pass for valid password', () => {
      expect(() => validatePassword('password123', 'Password')).not.toThrow();
    });

    it('should throw for empty password', () => {
      expect(() => validatePassword('', 'Password')).toThrow(ValidationError);
    });
  });

  describe('validateEmailFormat', () => {
    it('should pass for valid email', () => {
      expect(() => validateEmailFormat('test@example.com')).not.toThrow();
    });

    it('should pass for email with subdomain', () => {
      expect(() => validateEmailFormat('user@mail.example.com')).not.toThrow();
    });

    it('should pass for email with plus sign', () => {
      expect(() => validateEmailFormat('user+tag@example.com')).not.toThrow();
    });

    it('should throw for invalid email format', () => {
      expect(() => validateEmailFormat('invalid-email')).toThrow(ValidationError);
      expect(() => validateEmailFormat('@example.com')).toThrow(ValidationError);
      expect(() => validateEmailFormat('user@')).toThrow(ValidationError);
      expect(() => validateEmailFormat('user@example')).toThrow(ValidationError);
    });

    it('should throw for null', () => {
      expect(() => validateEmailFormat(null as any)).toThrow(ValidationError);
    });
  });

  describe('validateRange', () => {
    it('should pass for value in range', () => {
      expect(() => validateRange(5, 1, 10, 'Value')).not.toThrow();
    });

    it('should throw for value below range', () => {
      expect(() => validateRange(0, 1, 10, 'Value')).toThrow(ValidationError);
    });

    it('should throw for value above range', () => {
      expect(() => validateRange(11, 1, 10, 'Value')).toThrow(ValidationError);
    });
  });

  describe('safeTrim', () => {
    it('should trim valid string', () => {
      expect(safeTrim('  test  ')).toBe('test');
    });

    it('should return empty string for null', () => {
      expect(safeTrim(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(safeTrim(undefined)).toBe('');
    });
  });

  describe('isNotEmpty', () => {
    it('should return true for non-empty string', () => {
      expect(isNotEmpty('test')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });
});

