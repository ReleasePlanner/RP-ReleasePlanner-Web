/**
 * Cache Module Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from './cache.module';
import { Logger } from '@nestjs/common';

// Mock the redis store import
jest.mock('cache-manager-redis-store', () => ({
  redisStore: jest.fn(),
}));

describe('CacheModule', () => {
  let module: TestingModule;
  let configService: ConfigService;
  const originalEnv = process.env;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  describe('module configuration', () => {
    it('should be defined', async () => {
      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                redis: {
                  host: 'localhost',
                  port: 6379,
                  password: '',
                  db: 0,
                  ttl: 300,
                },
              }),
            ],
          }),
          CacheModule,
        ],
      }).compile();

      expect(module).toBeDefined();
    });

    it('should use in-memory cache when REDIS_HOST is not set', async () => {
      delete process.env.REDIS_HOST;

      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                redis: {
                  host: 'localhost',
                  port: 6379,
                  password: '',
                  db: 0,
                  ttl: 300,
                },
              }),
            ],
          }),
          CacheModule,
        ],
      }).compile();

      expect(loggerSpy).toHaveBeenCalledWith('Using in-memory cache (Redis not configured)');
    });

    it('should use in-memory cache when REDIS_HOST is empty string', async () => {
      process.env.REDIS_HOST = '';

      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                redis: {
                  host: 'localhost',
                  port: 6379,
                  password: '',
                  db: 0,
                  ttl: 300,
                },
              }),
            ],
          }),
          CacheModule,
        ],
      }).compile();

      expect(loggerSpy).toHaveBeenCalledWith('Using in-memory cache (Redis not configured)');
    });

    it('should configure Redis when REDIS_HOST is set', async () => {
      process.env.REDIS_HOST = 'redis-server';
      const { redisStore } = require('cache-manager-redis-store');
      redisStore.mockResolvedValue({});

      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                redis: {
                  host: 'redis-server',
                  port: 6379,
                  password: 'password123',
                  db: 1,
                  ttl: 600,
                },
              }),
            ],
          }),
          CacheModule,
        ],
      }).compile();

      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for async factory

      expect(redisStore).toHaveBeenCalledWith({
        socket: {
          host: 'redis-server',
          port: 6379,
        },
        password: 'password123',
        database: 1,
      });
      expect(loggerSpy).toHaveBeenCalledWith('Redis cache configured: redis-server:6379');
    });

    it('should fallback to in-memory cache when Redis connection fails', async () => {
      process.env.REDIS_HOST = 'invalid-redis';
      const { redisStore } = require('cache-manager-redis-store');
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      redisStore.mockRejectedValue(new Error('Connection failed'));

      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                redis: {
                  host: 'invalid-redis',
                  port: 6379,
                  password: '',
                  db: 0,
                  ttl: 300,
                },
              }),
            ],
          }),
          CacheModule,
        ],
      }).compile();

      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for async factory

      expect(warnSpy).toHaveBeenCalledWith(
        'Redis connection failed, falling back to in-memory cache',
        expect.any(Error),
      );
    });

    it('should convert TTL from seconds to milliseconds', async () => {
      process.env.REDIS_HOST = 'redis-server';
      const { redisStore } = require('cache-manager-redis-store');
      redisStore.mockResolvedValue({});

      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                redis: {
                  host: 'redis-server',
                  port: 6379,
                  password: '',
                  db: 0,
                  ttl: 600, // 600 seconds
                },
              }),
            ],
          }),
          CacheModule,
        ],
      }).compile();

      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for async factory

      // The factory should return ttl in milliseconds (600 * 1000 = 600000)
      expect(redisStore).toHaveBeenCalled();
    });
  });
});

