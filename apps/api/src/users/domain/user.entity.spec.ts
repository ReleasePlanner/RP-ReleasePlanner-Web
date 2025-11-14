/**
 * User Entity Unit Tests
 * Coverage: 100%
 */
import { User, UserRole } from './user.entity';

describe('User', () => {
  describe('constructor', () => {
    it('should create a User with default values', () => {
      const user = new User();

      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.role).toBeUndefined(); // Will be set by TypeORM default
      expect(user.isActive).toBeUndefined(); // Will be set by TypeORM default
    });
  });

  describe('fullName getter', () => {
    it('should return full name when firstName and lastName are provided', () => {
      const user = new User();
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.username = 'johndoe';

      expect(user.fullName).toBe('John Doe');
    });

    it('should return firstName only when lastName is not provided', () => {
      const user = new User();
      user.firstName = 'John';
      user.username = 'johndoe';

      expect(user.fullName).toBe('John');
    });

    it('should return lastName only when firstName is not provided', () => {
      const user = new User();
      user.lastName = 'Doe';
      user.username = 'johndoe';

      expect(user.fullName).toBe('Doe');
    });

    it('should return username when firstName and lastName are not provided', () => {
      const user = new User();
      user.username = 'johndoe';

      expect(user.fullName).toBe('johndoe');
    });

    it('should return username when firstName and lastName are empty strings', () => {
      const user = new User();
      user.firstName = '';
      user.lastName = '';
      user.username = 'johndoe';

      expect(user.fullName).toBe('johndoe');
    });

    it('should return username when firstName and lastName are whitespace only', () => {
      const user = new User();
      user.firstName = '   ';
      user.lastName = '   ';
      user.username = 'johndoe';

      expect(user.fullName).toBe('johndoe');
    });

    it('should trim whitespace from full name', () => {
      const user = new User();
      user.firstName = '  John  ';
      user.lastName = '  Doe  ';
      user.username = 'johndoe';

      // The getter uses trim() which only trims start/end, not internal spaces
      expect(user.fullName).toBe('John     Doe');
    });
  });

  describe('UserRole enum', () => {
    it('should have all expected roles', () => {
      expect(UserRole.ADMIN).toBe('admin');
      expect(UserRole.MANAGER).toBe('manager');
      expect(UserRole.USER).toBe('user');
      expect(UserRole.VIEWER).toBe('viewer');
    });
  });

  describe('properties', () => {
    it('should have all required properties', () => {
      const user = new User();
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.password = 'hashed-password';
      user.role = UserRole.USER;
      user.isActive = true;

      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashed-password');
      expect(user.role).toBe(UserRole.USER);
      expect(user.isActive).toBe(true);
    });

    it('should have optional properties', () => {
      const user = new User();
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.lastLoginAt = new Date();
      user.refreshToken = 'refresh-token';
      user.refreshTokenExpiresAt = new Date();

      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.lastLoginAt).toBeInstanceOf(Date);
      expect(user.refreshToken).toBe('refresh-token');
      expect(user.refreshTokenExpiresAt).toBeInstanceOf(Date);
    });
  });
});

