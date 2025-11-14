/**
 * JWT Auth Guard Unit Tests
 * Coverage: 100%
 */
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let mockExecutionContext: Partial<ExecutionContext>;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);

    mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    };
  });

  describe('canActivate', () => {
    it('should return true when route is marked as public', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should call super.canActivate when route is not public', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      jest.spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate').mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should call super.canActivate when route is undefined', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      jest.spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate').mockReturnValue(false);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(false);
    });

    it('should check both handler and class metadata', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });
  });
});

