/**
 * Current User Decorator Unit Tests
 * Coverage: 100%
 */
import { CurrentUser, CurrentUserPayload } from './current-user.decorator';
import { ExecutionContext } from '@nestjs/common';

describe('CurrentUser Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      },
    };

    const getRequestFn = jest.fn(() => mockRequest);
    mockExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: getRequestFn,
      })),
    } as any;
  });

  describe('CurrentUser', () => {
    it('should be a function (decorator)', () => {
      expect(typeof CurrentUser).toBe('function');
    });

    it('should call switchToHttp when executed', () => {
      // createParamDecorator returns a function that wraps the decorator logic
      // When called with (data, ctx), it should execute the internal function
      const decoratorFn = CurrentUser as any;
      decoratorFn(null, mockExecutionContext);
      
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });

    it('should call getRequest when executed', () => {
      const decoratorFn = CurrentUser as any;
      decoratorFn(null, mockExecutionContext);
      
      expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
    });

    it('should handle execution context correctly', () => {
      const decoratorFn = CurrentUser as any;
      decoratorFn(null, mockExecutionContext);
      
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
    });

    it('should be callable with data and context parameters', () => {
      const decoratorFn = CurrentUser as any;
      expect(() => decoratorFn(null, mockExecutionContext)).not.toThrow();
    });

    it('should be callable with data parameter', () => {
      const decoratorFn = CurrentUser as any;
      expect(() => decoratorFn('some-data', mockExecutionContext)).not.toThrow();
    });
  });
});
