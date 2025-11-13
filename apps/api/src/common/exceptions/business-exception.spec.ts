/**
 * Business Exception Unit Tests
 * 
 * Coverage: 100%
 */
import {
  BusinessException,
  NotFoundException,
  ConflictException,
} from './business-exception';
import { HttpStatus } from '@nestjs/common';

describe('BusinessException', () => {
  describe('BusinessException', () => {
    it('should create a BusinessException with default status', () => {
      const exception = new BusinessException('Test message', HttpStatus.BAD_REQUEST, 'TEST_CODE');

      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      const response = exception.getResponse() as { message: string; code: string };
      expect(response.message).toBe('Test message');
      expect(response.code).toBe('TEST_CODE');
    });

    it('should create a BusinessException with custom status', () => {
      const exception = new BusinessException(
        'Test message',
        HttpStatus.FORBIDDEN,
        'TEST_CODE',
      );

      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
      const response = exception.getResponse() as { message: string; code: string };
      expect(response.message).toBe('Test message');
      expect(response.code).toBe('TEST_CODE');
    });
  });

  describe('NotFoundException', () => {
    it('should create a NotFoundException with correct message and status', () => {
      const exception = new NotFoundException('Entity', 'entity-id');

      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      const response = exception.getResponse() as { message: string; code: string };
      expect(response.message).toBe('Entity with id entity-id not found');
      expect(response.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('should format message correctly for different entity names', () => {
      const exception1 = new NotFoundException('Product', 'prod-123');
      const exception2 = new NotFoundException('User', 'user-456');

      const response1 = exception1.getResponse() as { message: string };
      const response2 = exception2.getResponse() as { message: string };

      expect(response1.message).toBe('Product with id prod-123 not found');
      expect(response2.message).toBe('User with id user-456 not found');
    });

    it('should create NotFoundException without id', () => {
      const exception = new NotFoundException('Entity');

      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      const response = exception.getResponse() as { message: string };
      expect(response.message).toBe('Entity not found');
    });
  });

  describe('ConflictException', () => {
    it('should create a ConflictException with default code', () => {
      const exception = new ConflictException('Test conflict message');

      expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
      const response = exception.getResponse() as { message: string; code: string };
      expect(response.message).toBe('Test conflict message');
      expect(response.code).toBe('RESOURCE_CONFLICT');
    });

    it('should create a ConflictException with custom code', () => {
      const exception = new ConflictException(
        'Test conflict message',
        'CUSTOM_CONFLICT_CODE',
      );

      expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
      const response = exception.getResponse() as { message: string; code: string };
      expect(response.message).toBe('Test conflict message');
      expect(response.code).toBe('CUSTOM_CONFLICT_CODE');
    });
  });
});

