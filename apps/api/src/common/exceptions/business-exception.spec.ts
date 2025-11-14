/**
 * Business Exception Tests
 * Coverage: 100%
 */
import { HttpStatus } from '@nestjs/common';
import {
  BusinessException,
  NotFoundException,
  ConflictException,
  ValidationException,
} from './business-exception';

describe('BusinessException', () => {
  it('should create exception with default status code', () => {
    const exception = new BusinessException('Test message');

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.code).toBeUndefined();
  });

  it('should create exception with custom status code', () => {
    const exception = new BusinessException('Test message', HttpStatus.NOT_FOUND);

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });

  it('should create exception with code', () => {
    const exception = new BusinessException('Test message', HttpStatus.BAD_REQUEST, 'TEST_CODE');

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.code).toBe('TEST_CODE');
  });
});

describe('NotFoundException', () => {
  it('should create exception with id', () => {
    const exception = new NotFoundException('Resource', 'test-id');

    expect(exception.message).toBe('Resource with id test-id not found');
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('should create exception without id', () => {
    const exception = new NotFoundException('Resource');

    expect(exception.message).toBe('Resource not found');
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.code).toBe('RESOURCE_NOT_FOUND');
  });
});

describe('ConflictException', () => {
  it('should create exception with default code', () => {
    const exception = new ConflictException('Test message');

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(exception.code).toBe('RESOURCE_CONFLICT');
  });

  it('should create exception with custom code', () => {
    const exception = new ConflictException('Test message', 'CUSTOM_CODE');

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(exception.code).toBe('CUSTOM_CODE');
  });
});

describe('ValidationException', () => {
  it('should create exception without field', () => {
    const exception = new ValidationException('Test message');

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.code).toBe('VALIDATION_ERROR');
  });

  it('should create exception with field', () => {
    const exception = new ValidationException('Test message', 'email');

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.code).toBe('VALIDATION_ERROR_EMAIL');
  });
});
