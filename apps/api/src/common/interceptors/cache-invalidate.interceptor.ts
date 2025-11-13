/**
 * Cache Invalidate Interceptor
 * 
 * Invalidates cache patterns after mutations
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../cache/cache.service';
import { INVALIDATE_CACHE_METADATA } from '../decorators/cache.decorator';

@Injectable()
export class CacheInvalidateInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private cacheService: CacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const patterns = this.reflector.getAllAndOverride<string[]>(
      INVALIDATE_CACHE_METADATA,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      tap(async () => {
        if (patterns && patterns.length > 0) {
          for (const pattern of patterns) {
            await this.cacheService.delPattern(pattern);
          }
        }
      }),
    );
  }
}

