/**
 * Component Version Entity Unit Tests
 * Coverage: 100%
 */
import { ComponentVersion, ComponentType } from './component-version.entity';

describe('ComponentVersion', () => {
  describe('constructor', () => {
    it('should create a ComponentVersion with all properties', () => {
      const component = new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0');

      expect(component.type).toBe(ComponentType.WEB);
      expect(component.currentVersion).toBe('1.0.0');
      expect(component.previousVersion).toBe('0.9.0');
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0');
      }).not.toThrow();
    });

    it('should throw error when type is invalid', () => {
      expect(() => {
        new ComponentVersion('invalid' as ComponentType, '1.0.0', '0.9.0');
      }).toThrow('Invalid component type: invalid');
    });

    it('should throw error when currentVersion is empty', () => {
      expect(() => {
        new ComponentVersion(ComponentType.WEB, '', '0.9.0');
      }).toThrow('Current version is required');
    });

    it('should throw error when previousVersion is empty', () => {
      expect(() => {
        new ComponentVersion(ComponentType.WEB, '1.0.0', '');
      }).toThrow('Previous version is required');
    });

    it('should accept all valid component types', () => {
      expect(() => {
        new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0');
      }).not.toThrow();
      expect(() => {
        new ComponentVersion(ComponentType.SERVICES, '1.0.0', '0.9.0');
      }).not.toThrow();
      expect(() => {
        new ComponentVersion(ComponentType.MOBILE, '1.0.0', '0.9.0');
      }).not.toThrow();
    });
  });
});

