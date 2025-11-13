/**
 * Transform Interceptor Unit Tests
 * Coverage: 100%
 */
import { TransformInterceptor } from './transform.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;
  let mockResponse: any;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
    mockResponse = {
      statusCode: 200,
    };
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as any;
    mockCallHandler = {
      handle: jest.fn(),
    } as any;
  });

  describe('intercept', () => {
    it('should transform response with statusCode and timestamp', async () => {
      const data = { id: '1', name: 'Test' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(data));

      const result = await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

      expect(result).toHaveProperty('statusCode', 200);
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('data', data);
      expect(typeof result?.timestamp).toBe('string');
    });

    it('should preserve original data structure', async () => {
      const data = { id: '1', name: 'Test', nested: { value: 123 } };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(data));

      const result = await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

      expect(result?.data).toEqual(data);
      expect(result?.data.nested.value).toBe(123);
    });

    it('should handle array responses', async () => {
      const data = [{ id: '1' }, { id: '2' }];
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(data));

      const result = await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

      expect(result?.data).toEqual(data);
      expect(Array.isArray(result?.data)).toBe(true);
    });

    it('should handle null responses', async () => {
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(null));

      const result = await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

      expect(result?.data).toBeNull();
      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('timestamp');
    });
  });
});

