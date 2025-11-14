/**
 * Retry Decorator Unit Tests
 * Coverage: 100%
 */
import { Retry } from './retry.decorator';
import { Logger } from '@nestjs/common';

describe('Retry', () => {
  let mockLogger: jest.SpyInstance;

  beforeEach(() => {
    mockLogger = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('decorator', () => {
    it('should retry failed method calls', async () => {
      let attempts = 0;
      const testMethod = jest.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Test error');
        }
        return 'success';
      });

      class TestClass {
        @Retry(3, 10, 1)
        async testMethod() {
          return testMethod();
        }
      }

      const instance = new TestClass();
      const result = await instance.testMethod();

      expect(result).toBe('success');
      expect(testMethod).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max attempts', async () => {
      const testMethod = jest.fn(async () => {
        throw new Error('Persistent error');
      });

      class TestClass {
        @Retry(3, 10, 1)
        async testMethod() {
          return testMethod();
        }
      }

      const instance = new TestClass();

      await expect(instance.testMethod()).rejects.toThrow('Persistent error');
      expect(testMethod).toHaveBeenCalledTimes(3);
    });

    it('should use default parameters', async () => {
      let attempts = 0;
      const testMethod = jest.fn(async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Test error');
        }
        return 'success';
      });

      class TestClass {
        @Retry()
        async testMethod() {
          return testMethod();
        }
      }

      const instance = new TestClass();
      const result = await instance.testMethod();

      expect(result).toBe('success');
      expect(testMethod).toHaveBeenCalledTimes(2);
    });

    it('should apply exponential backoff', async () => {
      const delays: number[] = [];
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((fn: (...args: unknown[]) => unknown, delay: number) => {
        delays.push(delay);
        return originalSetTimeout(fn, delay);
      }) as any;

      let attempts = 0;
      const testMethod = jest.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Test error');
        }
        return 'success';
      });

      class TestClass {
        @Retry(3, 100, 2)
        async testMethod() {
          return testMethod();
        }
      }

      const instance = new TestClass();
      await instance.testMethod();

      expect(delays).toEqual([100, 200]); // 100 * 2^0, 100 * 2^1
      global.setTimeout = originalSetTimeout;
    });

    it('should log warnings for failed attempts', async () => {
      const testMethod = jest.fn(async () => {
        throw new Error('Test error');
      });

      class TestClass {
        @Retry(2, 10, 1)
        async testMethod() {
          return testMethod();
        }
      }

      const instance = new TestClass();

      await expect(instance.testMethod()).rejects.toThrow('Test error');
      expect(mockLogger).toHaveBeenCalledTimes(2);
    });

    it('should log error after all attempts fail', async () => {
      const errorLogger = jest.spyOn(Logger.prototype, 'error');
      const testMethod = jest.fn(async () => {
        throw new Error('Persistent error');
      });

      class TestClass {
        @Retry(2, 10, 1)
        async testMethod() {
          return testMethod();
        }
      }

      const instance = new TestClass();

      await expect(instance.testMethod()).rejects.toThrow('Persistent error');
      expect(errorLogger).toHaveBeenCalled();
    });

    it('should succeed on first attempt', async () => {
      const testMethod = jest.fn(async () => {
        return 'success';
      });

      class TestClass {
        @Retry(3, 10, 1)
        async testMethod() {
          return testMethod();
        }
      }

      const instance = new TestClass();
      const result = await instance.testMethod();

      expect(result).toBe('success');
      expect(testMethod).toHaveBeenCalledTimes(1);
      expect(mockLogger).not.toHaveBeenCalled();
    });

    it('should preserve method context', async () => {
      class TestClass {
        value = 'test';

        @Retry(1, 10, 1)
        async testMethod() {
          return this.value;
        }
      }

      const instance = new TestClass();
      const result = await instance.testMethod();

      expect(result).toBe('test');
    });

    it('should preserve method arguments', async () => {
      const testMethod = jest.fn(async (arg1: string, arg2: number) => {
        return `${arg1}-${arg2}`;
      });

      class TestClass {
        @Retry(1, 10, 1)
        async testMethod(arg1: string, arg2: number) {
          return testMethod(arg1, arg2);
        }
      }

      const instance = new TestClass();
      const result = await instance.testMethod('hello', 42);

      expect(result).toBe('hello-42');
      expect(testMethod).toHaveBeenCalledWith('hello', 42);
    });
  });
});

