/**
 * Redis Config Unit Tests
 * Coverage: 100%
 */
import redisConfig from './redis.config';

describe('RedisConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('default configuration', () => {
    it('should return default redis configuration', () => {
      const config = redisConfig();

      expect(config.host).toBe('localhost');
      expect(config.port).toBe(6379);
      expect(config.password).toBeUndefined();
      expect(config.db).toBe(0);
      expect(config.ttl).toBe(3600);
      expect(config.max).toBe(10);
    });

    it('should use environment variables when provided', () => {
      process.env.REDIS_HOST = 'redis-host';
      process.env.REDIS_PORT = '6380';
      process.env.REDIS_PASSWORD = 'redis-password';
      process.env.REDIS_DB = '1';
      process.env.REDIS_TTL = '7200';
      process.env.REDIS_MAX_CONNECTIONS = '20';

      const config = redisConfig();

      expect(config.host).toBe('redis-host');
      expect(config.port).toBe(6380);
      expect(config.password).toBe('redis-password');
      expect(config.db).toBe(1);
      expect(config.ttl).toBe(7200);
      expect(config.max).toBe(20);
    });

    it('should have retryStrategy function', () => {
      const config = redisConfig();

      expect(typeof config.retryStrategy).toBe('function');
    });

    it('should calculate retry delay correctly', () => {
      const config = redisConfig();

      expect(config.retryStrategy(1)).toBe(50);
      expect(config.retryStrategy(2)).toBe(100);
      expect(config.retryStrategy(10)).toBe(500);
      expect(config.retryStrategy(50)).toBe(2000); // Max delay
      expect(config.retryStrategy(100)).toBe(2000); // Max delay
    });

    it('should have reconnectOnError function', () => {
      const config = redisConfig();

      expect(typeof config.reconnectOnError).toBe('function');
    });

    it('should reconnect on READONLY error', () => {
      const config = redisConfig();
      const readonlyError = new Error('READONLY You can\'t write against a read only replica.');

      expect(config.reconnectOnError(readonlyError)).toBe(true);
    });

    it('should not reconnect on other errors', () => {
      const config = redisConfig();
      const otherError = new Error('Connection refused');

      expect(config.reconnectOnError(otherError)).toBe(false);
    });

    it('should not reconnect on error without READONLY message', () => {
      const config = redisConfig();
      const error = new Error('Some other error');

      expect(config.reconnectOnError(error)).toBe(false);
    });

    it('should handle retryStrategy with increasing delays', () => {
      const config = redisConfig();

      const delays = [1, 2, 3, 4, 5].map((times) => config.retryStrategy(times));

      expect(delays[0]).toBe(50);
      expect(delays[1]).toBe(100);
      expect(delays[2]).toBe(150);
      expect(delays[3]).toBe(200);
      expect(delays[4]).toBe(250);
    });

    it('should cap retry delay at 2000ms', () => {
      const config = redisConfig();

      expect(config.retryStrategy(100)).toBe(2000);
      expect(config.retryStrategy(200)).toBe(2000);
    });
  });
});

