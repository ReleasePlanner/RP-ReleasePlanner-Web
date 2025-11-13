/**
 * Redis Configuration
 * 
 * Redis configuration for caching and session storage
 */
import { registerAs } from '@nestjs/config';

export default registerAs(
  'redis',
  () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10), // Default 1 hour
    max: parseInt(process.env.REDIS_MAX_CONNECTIONS || '10', 10),
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError: (err: Error) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
  }),
);

