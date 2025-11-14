/**
 * Cache Module
 * 
 * Configures caching with Redis (if available) or in-memory fallback
 */
import { Module, Global, Logger } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

const logger = new Logger('CacheModule');

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redis = configService.get('redis');
        const redisHost = process.env.REDIS_HOST;
        
        // Use Redis if configured, otherwise use in-memory cache
        if (redisHost && redisHost !== '') {
          try {
            // Try to use Redis store
            const { redisStore } = await import('cache-manager-redis-store');
            
            const store = await redisStore({
              socket: {
                host: redis.host,
                port: redis.port,
              },
              password: redis.password,
              database: redis.db,
            });

            logger.log(`Redis cache configured: ${redis.host}:${redis.port}`);

            return {
              store: () => store,
              ttl: redis.ttl * 1000, // Convert to milliseconds
            };
          } catch (error) {
            logger.warn('Redis connection failed, falling back to in-memory cache', error);
            return {
              ttl: redis.ttl * 1000,
            };
          }
        }

        // Fallback to in-memory cache
        logger.log('Using in-memory cache (Redis not configured)');
        return {
          ttl: redis.ttl * 1000,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}

