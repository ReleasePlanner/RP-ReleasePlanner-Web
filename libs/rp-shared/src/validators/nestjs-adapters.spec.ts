/**
 * Tests for NestJS Adapters
 *
 * Note: These tests require @nestjs/common to be available
 */

import { BadRequestException } from '@nestjs/common';
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
} from './nestjs-adapters';

describe('NestJS Adapters', () => {
  describe('validateString', () => {
    it('should pass for valid string', () => {
      expect(() => validateString('test', 'Field')).not.toThrow();
    });

    it('should throw BadRequestException for null', () => {
      expect(() => validateString(null, 'Field')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for empty string', () => {
      expect(() => validateString('   ', 'Field')).toThrow(BadRequestException);
    });
  });

  describe('validateId', () => {
    it('should pass for valid ID', () => {
      expect(() => validateId('test-id', 'Resource')).not.toThrow();
    });

    it('should throw BadRequestException for null', () => {
      expect(() => validateId(null, 'Resource')).toThrow(BadRequestException);
    });
  });

  describe('validateObject', () => {
    it('should pass for valid object', () => {
      expect(() => validateObject({}, 'Object')).not.toThrow();
    });

    it('should throw BadRequestException for null', () => {
      expect(() => validateObject(null, 'Object')).toThrow(BadRequestException);
    });
  });

  describe('validateArray', () => {
    it('should pass for valid array', () => {
      expect(() => validateArray([], 'Array')).not.toThrow();
    });

    it('should throw BadRequestException for null', () => {
      expect(() => validateArray(null, 'Array')).toThrow(BadRequestException);
    });
  });

  describe('validateNumber', () => {
    it('should pass for valid number', () => {
      expect(() => validateNumber(123, 'Number')).not.toThrow();
    });

    it('should throw BadRequestException for NaN', () => {
      expect(() => validateNumber(NaN, 'Number')).toThrow(BadRequestException);
    });
  });

  describe('validateDateString', () => {
    it('should pass for valid date string', () => {
      expect(() => validateDateString('2024-01-01', 'Date')).not.toThrow();
    });

    it('should throw BadRequestException for invalid date', () => {
      expect(() => validateDateString('invalid-date', 'Date')).toThrow(BadRequestException);
    });
  });

  describe('validatePassword', () => {
    it('should pass for valid password', () => {
      expect(() => validatePassword('password123')).not.toThrow();
    });

    it('should throw BadRequestException for empty password', () => {
      expect(() => validatePassword('')).toThrow(BadRequestException);
    });
  });

  describe('validateEmailFormat', () => {
    it('should pass for valid email', () => {
      expect(() => validateEmailFormat('test@example.com')).not.toThrow();
    });

    it('should throw BadRequestException for invalid email', () => {
      expect(() => validateEmailFormat('invalid-email')).toThrow(BadRequestException);
    });
  });

  describe('validateRange', () => {
    it('should pass for value in range', () => {
      expect(() => validateRange(5, 1, 10, 'Value')).not.toThrow();
    });

    it('should throw BadRequestException for value out of range', () => {
      expect(() => validateRange(11, 1, 10, 'Value')).toThrow(BadRequestException);
    });
  });
});

