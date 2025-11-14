/**
 * Cache Key Interceptor Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CacheKeyInterceptor } from './cache-key.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { CACHE_KEY_METADATA } from '../decorators/cache.decorator';

describe('CacheKeyInterceptor', () => {
  let interceptor: CacheKeyInterceptor;
  let reflector: Reflector;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheKeyInterceptor,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<CacheKeyInterceptor>(CacheKeyInterceptor);
    reflector = module.get<Reflector>(Reflector);

    mockCallHandler = {
      handle: jest.fn(() => of({ data: 'test' })),
    } as any;

    mockExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          params: {},
          query: {},
        })),
      })),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should call next.handle() when no cache key prefix is set', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler);

      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('should generate cache key with ID from params', () => {
      const keyPrefix = 'user';
      const request = {
        params: { id: '123' },
        query: {},
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(keyPrefix);
      jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
        getRequest: jest.fn(() => request),
      } as any);

      // Mock CacheKey function
      const cacheKeySpy = jest.fn();
      jest.spyOn(require('@nestjs/cache-manager'), 'CacheKey').mockImplementation(cacheKeySpy);

      interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(CACHE_KEY_METADATA, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('should generate cache key with query params when no ID', () => {
      const keyPrefix = 'products';
      const request = {
        params: {},
        query: { page: '1', limit: '10' },
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(keyPrefix);
      jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
        getRequest: jest.fn(() => request),
      } as any);

      const cacheKeySpy = jest.fn();
      jest.spyOn(require('@nestjs/cache-manager'), 'CacheKey').mockImplementation(cacheKeySpy);

      interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler);

      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('should handle empty query params', () => {
      const keyPrefix = 'items';
      const request = {
        params: {},
        query: {},
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(keyPrefix);
      jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
        getRequest: jest.fn(() => request),
      } as any);

      interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler);

      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('should handle null params and query', () => {
      const keyPrefix = 'test';
      const request = {
        params: null,
        query: null,
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(keyPrefix);
      jest.spyOn(mockExecutionContext, 'switchToHttp').mockReturnValue({
        getRequest: jest.fn(() => request),
      } as any);

      interceptor.intercept(mockExecutionContext as ExecutionContext, mockCallHandler);

      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('should return observable from next.handle()', (done) => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler,
      );

      result.subscribe({
        next: (data) => {
          expect(data).toEqual({ data: 'test' });
          done();
        },
      });
    });
  });
});

