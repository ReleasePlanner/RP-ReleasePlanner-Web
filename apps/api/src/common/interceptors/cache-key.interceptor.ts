/**
 * Cache Key Interceptor
 * 
 * Generates dynamic cache keys based on request parameters
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CacheKey } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import { CACHE_KEY_METADATA } from '../decorators/cache.decorator';

@Injectable()
export class CacheKeyInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const keyPrefix = this.reflector.getAllAndOverride<string>(
      CACHE_KEY_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (keyPrefix) {
      // Generate cache key based on prefix and route params
      const params = request.params || {};
      const query = request.query || {};
      
      // Use ID if available, otherwise use query params
      const keyParts = params.id 
        ? [keyPrefix, params.id]
        : [keyPrefix, ...Object.values(query)];
      
      const cacheKey = keyParts.join(':');
      CacheKey(cacheKey);
    }

    return next.handle();
  }
}

