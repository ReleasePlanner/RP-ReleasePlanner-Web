/**
 * Cache Decorators
 * 
 * Decorators for caching method results
 */
import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

/**
 * Cache decorator - Cache method result
 * 
 * @param ttl Time to live in seconds (default: 3600)
 * @param keyPrefix Cache key prefix (default: method name)
 */
export function CacheResult(ttl: number = 3600, keyPrefix?: string) {
  return applyDecorators(
    UseInterceptors(CacheInterceptor),
    CacheTTL(ttl),
    SetMetadata(CACHE_KEY_METADATA, keyPrefix),
  );
}

/**
 * Cache key decorator - Set custom cache key
 */
export const CacheKeyCustom = (key: string) => CacheKey(key);

/**
 * Invalidate cache decorator - Mark method to invalidate cache
 */
export const INVALIDATE_CACHE_METADATA = 'invalidate:cache';

export function InvalidateCache(...patterns: string[]) {
  return SetMetadata(INVALIDATE_CACHE_METADATA, patterns);
}

