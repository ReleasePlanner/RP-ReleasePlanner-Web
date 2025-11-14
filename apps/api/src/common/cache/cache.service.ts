/**
 * Cache Service
 * 
 * Service for managing Redis cache operations
 */
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: any) {}

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const result = await (this.cacheManager as any).get(key);
      return result as T | undefined;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}`, error instanceof Error ? error.stack : String(error));
      return undefined;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}`, error instanceof Error ? error.stack : String(error));
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}`, error instanceof Error ? error.stack : String(error));
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      // Note: This requires Redis store, not all cache managers support pattern deletion
      const store = (this.cacheManager as any).store;
      if (store && typeof store.keys === 'function') {
        const keys = await store.keys(pattern);
        if (keys && keys.length > 0) {
          await Promise.all(keys.map((key: string) => this.del(key)));
          this.logger.debug(`Deleted ${keys.length} cache keys matching pattern ${pattern}`);
        }
      }
    } catch (error) {
      this.logger.error(`Cache pattern delete error for pattern ${pattern}`, error instanceof Error ? error.stack : String(error));
    }
  }

  /**
   * Reset entire cache
   */
  async reset(): Promise<void> {
    try {
      await (this.cacheManager as any).reset();
      this.logger.debug('Cache reset completed');
    } catch (error) {
      this.logger.error('Cache reset error', error instanceof Error ? error.stack : String(error));
    }
  }

  /**
   * Generate cache key
   */
  static generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
  }
}

