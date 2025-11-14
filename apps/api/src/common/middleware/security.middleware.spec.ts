/**
 * Security Middleware Unit Tests
 * Coverage: 100%
 */
import { SecurityMiddleware } from './security.middleware';
import { Request, Response, NextFunction } from 'express';

describe('SecurityMiddleware', () => {
  let middleware: SecurityMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    middleware = new SecurityMiddleware();
    mockRequest = {
      secure: false,
    };
    mockResponse = {
      removeHeader: jest.fn(),
      setHeader: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  describe('use', () => {
    it('should remove X-Powered-By header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.removeHeader).toHaveBeenCalledWith('X-Powered-By');
    });

    it('should set X-Content-Type-Options header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    });

    it('should set X-Frame-Options header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    });

    it('should set X-XSS-Protection header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
    });

    it('should set Referrer-Policy header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Referrer-Policy',
        'strict-origin-when-cross-origin',
      );
    });

    it('should set Permissions-Policy header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=()',
      );
    });

    it('should call next()', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should set HSTS header in production with HTTPS', () => {
      process.env.NODE_ENV = 'production';
      mockRequest.secure = true;

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload',
      );
    });

    it('should not set HSTS header in development', () => {
      process.env.NODE_ENV = 'development';
      mockRequest.secure = true;

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      const hstsCall = (mockResponse.setHeader as jest.Mock).mock.calls.find(
        (call) => call[0] === 'Strict-Transport-Security',
      );
      expect(hstsCall).toBeUndefined();
    });

    it('should not set HSTS header when not secure', () => {
      process.env.NODE_ENV = 'production';
      mockRequest.secure = false;

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      const hstsCall = (mockResponse.setHeader as jest.Mock).mock.calls.find(
        (call) => call[0] === 'Strict-Transport-Security',
      );
      expect(hstsCall).toBeUndefined();
    });

    it('should set all security headers', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledTimes(5); // 5 security headers
    });

    it('should set HSTS header when both production and secure', () => {
      process.env.NODE_ENV = 'production';
      mockRequest.secure = true;

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledTimes(6); // 5 security headers + HSTS
    });
  });
});

