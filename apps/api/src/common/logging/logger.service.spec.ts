/**
 * Logger Service Tests
 * Coverage: 100%
 */
import { AppLoggerService } from './logger.service';

describe('AppLoggerService', () => {
  let service: AppLoggerService;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;
  let verboseSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new AppLoggerService('TestContext');
    logSpy = jest.spyOn(service['logger'], 'log').mockImplementation();
    errorSpy = jest.spyOn(service['logger'], 'error').mockImplementation();
    warnSpy = jest.spyOn(service['logger'], 'warn').mockImplementation();
    debugSpy = jest.spyOn(service['logger'], 'debug').mockImplementation();
    verboseSpy = jest.spyOn(service['logger'], 'verbose').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with context', () => {
      const logger = new AppLoggerService('CustomContext');
      expect(logger).toBeDefined();
    });

    it('should create logger with default context', () => {
      const logger = new AppLoggerService();
      expect(logger).toBeDefined();
    });
  });

  describe('log', () => {
    it('should log message', () => {
      service.log('Test message');

      expect(logSpy).toHaveBeenCalledWith('Test message', undefined);
    });

    it('should log message with context', () => {
      service.log('Test message', 'CustomContext');

      expect(logSpy).toHaveBeenCalledWith('Test message', 'CustomContext');
    });
  });

  describe('error', () => {
    it('should log error', () => {
      service.error('Error message');

      expect(errorSpy).toHaveBeenCalledWith('Error message', undefined, undefined);
    });

    it('should log error with trace and context', () => {
      service.error('Error message', 'trace', 'ErrorContext');

      expect(errorSpy).toHaveBeenCalledWith('Error message', 'trace', 'ErrorContext');
    });
  });

  describe('warn', () => {
    it('should log warning', () => {
      service.warn('Warning message');

      expect(warnSpy).toHaveBeenCalledWith('Warning message', undefined);
    });

    it('should log warning with context', () => {
      service.warn('Warning message', 'WarnContext');

      expect(warnSpy).toHaveBeenCalledWith('Warning message', 'WarnContext');
    });
  });

  describe('debug', () => {
    it('should log debug message', () => {
      service.debug('Debug message');

      expect(debugSpy).toHaveBeenCalledWith('Debug message', undefined);
    });

    it('should log debug message with context', () => {
      service.debug('Debug message', 'DebugContext');

      expect(debugSpy).toHaveBeenCalledWith('Debug message', 'DebugContext');
    });
  });

  describe('verbose', () => {
    it('should log verbose message', () => {
      service.verbose('Verbose message');

      expect(verboseSpy).toHaveBeenCalledWith('Verbose message', undefined);
    });

    it('should log verbose message with context', () => {
      service.verbose('Verbose message', 'VerboseContext');

      expect(verboseSpy).toHaveBeenCalledWith('Verbose message', 'VerboseContext');
    });
  });

  describe('logDatabase', () => {
    it('should log database operation', () => {
      service.logDatabase('SELECT', 'User', { id: '123' });

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"type":"database"'),
        'Database',
      );
    });
  });

  describe('logRequest', () => {
    it('should log API request', () => {
      service.logRequest('GET', '/api/users', 200, 150);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"type":"request"'),
        'HTTP',
      );
    });
  });

  describe('logError', () => {
    it('should log error with context', () => {
      const error = new Error('Test error');
      service.logError(error, 'ErrorContext', { userId: '123' });

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"type":"error"'),
        error.stack,
        'ErrorContext',
      );
    });

    it('should log error without context', () => {
      const error = new Error('Test error');
      service.logError(error);

      expect(errorSpy).toHaveBeenCalled();
    });
  });
});

