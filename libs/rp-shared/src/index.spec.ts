/**
 * Tests for rp-shared index exports
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
} from './index';

describe('rp-shared index', () => {
  it('should export all validators', () => {
    expect(validateString).toBeDefined();
    expect(validateId).toBeDefined();
    expect(validateObject).toBeDefined();
    expect(validateArray).toBeDefined();
    expect(validateNumber).toBeDefined();
    expect(validateDateString).toBeDefined();
    expect(validatePassword).toBeDefined();
    expect(validateEmailFormat).toBeDefined();
    expect(validateRange).toBeDefined();
  });

  it('should export utility functions', () => {
    expect(safeTrim).toBeDefined();
    expect(isNotEmpty).toBeDefined();
  });

  it('should export ValidationError', () => {
    expect(ValidationError).toBeDefined();
    expect(ValidationError.name).toBe('ValidationError');
  });

  it('should have working validators', () => {
    expect(() => validateString('test', 'Field')).not.toThrow();
    expect(() => validateId('test-id', 'Resource')).not.toThrow();
    expect(() => validateObject({}, 'Object')).not.toThrow();
  });

  it('should have working utility functions', () => {
    expect(safeTrim('  test  ')).toBe('test');
    expect(isNotEmpty('test')).toBe(true);
    expect(isNotEmpty('')).toBe(false);
  });
});

