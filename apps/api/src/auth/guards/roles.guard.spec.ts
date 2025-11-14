/**
 * Roles Guard Unit Tests
 * Coverage: 100%
 */
import { RolesGuard } from './roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/domain/user.entity';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);

    mockRequest = {
      user: {
        id: 'user-id',
        username: 'testuser',
        role: UserRole.USER,
      },
    };

    mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => mockRequest),
      })),
    };
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return false when required roles array is empty', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      // Empty array means some() returns false, so access is denied
      expect(result).toBe(false);
    });

    it('should return true when user has required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER, UserRole.ADMIN]);

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN, UserRole.MANAGER]);
      mockRequest.user.role = UserRole.USER;

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(false);
    });

    it('should return false when user is not present', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER]);
      mockRequest.user = undefined;

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(false);
    });

    it('should return false when user is null', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER]);
      mockRequest.user = null;

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(false);
    });

    it('should return true when user has ADMIN role and ADMIN is required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
      mockRequest.user.role = UserRole.ADMIN;

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has MANAGER role and MANAGER is required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.MANAGER]);
      mockRequest.user.role = UserRole.MANAGER;

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has VIEWER role and VIEWER is required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.VIEWER]);
      mockRequest.user.role = UserRole.VIEWER;

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should check both handler and class metadata', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER]);

      guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should return true when user role matches any of the required roles', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.USER,
      ]);
      mockRequest.user.role = UserRole.MANAGER;

      const result = guard.canActivate(mockExecutionContext as ExecutionContext);

      expect(result).toBe(true);
    });
  });
});

