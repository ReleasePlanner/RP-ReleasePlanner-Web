/**
 * Cache Service Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { Cache } from 'cache-manager';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: jest.Mocked<Cache>;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
      store: {
        keys: jest.fn(),
      },
    } as unknown as jest.Mocked<Cache>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return cached value', async () => {
      const cachedValue = { data: 'test' };
      cacheManager.get.mockResolvedValue(cachedValue);

      const result = await service.get('test-key');

      expect(result).toEqual(cachedValue);
      expect(cacheManager.get).toHaveBeenCalledWith('test-key');
    });

    it('should return undefined when key not found', async () => {
      cacheManager.get.mockResolvedValue(undefined);

      const result = await service.get('non-existent');

      expect(result).toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      cacheManager.get.mockRejectedValue(new Error('Cache error'));

      const result = await service.get('error-key');

      expect(result).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should set value in cache', async () => {
      cacheManager.set.mockResolvedValue(undefined);

      await service.set('test-key', { data: 'test' });

      expect(cacheManager.set).toHaveBeenCalledWith('test-key', { data: 'test' }, undefined);
    });

    it('should set value with TTL', async () => {
      cacheManager.set.mockResolvedValue(undefined);

      await service.set('test-key', { data: 'test' }, 3600);

      expect(cacheManager.set).toHaveBeenCalledWith('test-key', { data: 'test' }, 3600);
    });

    it('should handle errors gracefully', async () => {
      cacheManager.set.mockRejectedValue(new Error('Cache error'));

      await expect(service.set('error-key', { data: 'test' })).resolves.not.toThrow();
    });
  });

  describe('del', () => {
    it('should delete value from cache', async () => {
      cacheManager.del.mockResolvedValue(undefined);

      await service.del('test-key');

      expect(cacheManager.del).toHaveBeenCalledWith('test-key');
    });

    it('should handle errors gracefully', async () => {
      cacheManager.del.mockRejectedValue(new Error('Cache error'));

      await expect(service.del('error-key')).resolves.not.toThrow();
    });
  });

  describe('delPattern', () => {
    it('should delete keys matching pattern', async () => {
      const keys = ['key1', 'key2', 'key3'];
      const store = cacheManager.store as any;
      store.keys = jest.fn().mockResolvedValue(keys);
      cacheManager.del.mockResolvedValue(undefined);

      await service.delPattern('key*');

      expect(store.keys).toHaveBeenCalledWith('key*');
      expect(cacheManager.del).toHaveBeenCalledTimes(3);
    });

    it('should handle empty keys array', async () => {
      const store = cacheManager.store as any;
      store.keys = jest.fn().mockResolvedValue([]);

      await service.delPattern('non-existent*');

      expect(cacheManager.del).not.toHaveBeenCalled();
    });

    it('should handle when store.keys is not available', async () => {
      const store = cacheManager.store as any;
      store.keys = undefined;

      await expect(service.delPattern('pattern')).resolves.not.toThrow();
    });

    it('should handle errors gracefully', async () => {
      const store = cacheManager.store as any;
      store.keys = jest.fn().mockRejectedValue(new Error('Store error'));

      await expect(service.delPattern('pattern')).resolves.not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset entire cache', async () => {
      cacheManager.reset.mockResolvedValue(undefined);

      await service.reset();

      expect(cacheManager.reset).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      cacheManager.reset.mockRejectedValue(new Error('Cache error'));

      await expect(service.reset()).resolves.not.toThrow();
    });
  });

  describe('generateKey', () => {
    it('should generate cache key with prefix and parts', () => {
      const key = CacheService.generateKey('prefix', 'part1', 'part2', 123);

      expect(key).toBe('prefix:part1:part2:123');
    });

    it('should generate key with single part', () => {
      const key = CacheService.generateKey('prefix', 'part1');

      expect(key).toBe('prefix:part1');
    });
  });
});

