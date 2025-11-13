/**
 * Health Check Controller
 * 
 * Provides health check endpoints for monitoring
 */
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';
import { CacheService } from '../common/cache/cache.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private cacheService: CacheService,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024), // 500MB
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9, // 90% disk usage
        }),
    ]);
  }

  @Get('liveness')
  @Public()
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('readiness')
  @Public()
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('cache')
  @Public()
  async cacheStatus() {
    try {
      // Test cache connection
      const testKey = 'health:check';
      const testValue = Date.now().toString();
      await this.cacheService.set(testKey, testValue, 10);
      const retrieved = await this.cacheService.get<string>(testKey);
      await this.cacheService.del(testKey);

      return {
        status: retrieved === testValue ? 'ok' : 'error',
        message: retrieved === testValue ? 'Cache is working' : 'Cache test failed',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Cache error',
      };
    }
  }
}

