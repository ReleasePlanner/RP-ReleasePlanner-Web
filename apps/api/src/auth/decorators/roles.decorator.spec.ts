/**
 * Roles Decorator Unit Tests
 * Coverage: 100%
 */
import { Roles, ROLES_KEY } from './roles.decorator';
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/domain/user.entity';

// Mock SetMetadata
jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    SetMetadata: jest.fn((key, value) => () => ({ key, value })),
  };
});

describe('Roles Decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Roles', () => {
    it('should call SetMetadata with ROLES_KEY and roles array', () => {
      const roles = [UserRole.ADMIN, UserRole.USER];
      Roles(...roles);

      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
    });

    it('should work with single role', () => {
      Roles(UserRole.ADMIN);

      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, [UserRole.ADMIN]);
    });

    it('should work with multiple roles', () => {
      const roles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER];
      Roles(...roles);

      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
    });

    it('should work with empty roles array', () => {
      Roles();

      expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, []);
    });

    it('should export ROLES_KEY constant', () => {
      expect(ROLES_KEY).toBe('roles');
    });
  });
});

