/**
 * Database Exception Tests
 * Coverage: 100%
 */
import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { DatabaseException } from './database-exception';

describe('DatabaseException', () => {
  it('should create exception with default status code', () => {
    const exception = new DatabaseException('Test message');

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.code).toBeUndefined();
    expect(exception.originalError).toBeUndefined();
  });

  it('should create exception with custom status code', () => {
    const exception = new DatabaseException('Test message', HttpStatus.BAD_REQUEST);

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should create exception with code and original error', () => {
    const originalError = new Error('Original error');
    const exception = new DatabaseException('Test message', HttpStatus.BAD_REQUEST, 'TEST_CODE', originalError);

    expect(exception.message).toBe('Test message');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.code).toBe('TEST_CODE');
    expect(exception.originalError).toBe(originalError);
  });

  describe('fromTypeORMError', () => {
    it('should convert QueryFailedError to DatabaseException with default code', () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception).toBeInstanceOf(DatabaseException);
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(exception.code).toBe('DATABASE_ERROR');
      expect(exception.originalError).toBe(queryError);
    });

    it('should handle unique violation error (23505)', () => {
      const queryError = new QueryFailedError('INSERT INTO', [], new Error('DB error'));
      queryError.driverError = { code: '23505' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
      expect(exception.code).toBe('UNIQUE_VIOLATION');
    });

    it('should handle foreign key violation error (23503)', () => {
      const queryError = new QueryFailedError('INSERT INTO', [], new Error('DB error'));
      queryError.driverError = { code: '23503' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.code).toBe('FOREIGN_KEY_VIOLATION');
    });

    it('should handle not null violation error (23502)', () => {
      const queryError = new QueryFailedError('INSERT INTO', [], new Error('DB error'));
      queryError.driverError = { code: '23502' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.code).toBe('NOT_NULL_VIOLATION');
    });

    it('should handle check violation error (23514)', () => {
      const queryError = new QueryFailedError('INSERT INTO', [], new Error('DB error'));
      queryError.driverError = { code: '23514' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.code).toBe('CHECK_VIOLATION');
    });

    it('should handle undefined table error (42P01)', () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      queryError.driverError = { code: '42P01' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(exception.code).toBe('UNDEFINED_TABLE');
    });

    it('should handle undefined column error (42703)', () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      queryError.driverError = { code: '42703' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(exception.code).toBe('UNDEFINED_COLUMN');
    });

    it('should handle connection does not exist error (08003)', () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      queryError.driverError = { code: '08003' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(exception.code).toBe('CONNECTION_ERROR');
    });

    it('should handle connection failure error (08006)', () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      queryError.driverError = { code: '08006' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(exception.code).toBe('CONNECTION_ERROR');
    });

    it('should handle too many connections error (53300)', () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      queryError.driverError = { code: '53300' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(exception.code).toBe('TOO_MANY_CONNECTIONS');
    });

    it('should handle unknown error code', () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      queryError.driverError = { code: '99999' } as any;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(exception.code).toBe('DATABASE_ERROR');
    });

    it('should handle error without driverError', () => {
      const queryError = new QueryFailedError('SELECT *', [], new Error('DB error'));
      queryError.driverError = undefined;
      const exception = DatabaseException.fromTypeORMError(queryError);

      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(exception.code).toBe('DATABASE_ERROR');
    });
  });
});

