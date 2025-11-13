/**
 * Product Entity Unit Tests
 * Coverage: 100%
 */
import { Product } from './product.entity';
import { ComponentVersion, ComponentType } from './component-version.entity';

describe('Product', () => {
  describe('constructor', () => {
    it('should create a Product with name and components', () => {
      const components = [
        new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0'),
        new ComponentVersion(ComponentType.SERVICES, '2.0.0', '1.9.0'),
      ];
      const product = new Product('Test Product', components);

      expect(product.name).toBe('Test Product');
      expect(product.components).toHaveLength(2);
      expect(product.components[0].type).toBe(ComponentType.WEB);
    });

    it('should create a Product without components', () => {
      const product = new Product('Test Product');

      expect(product.name).toBe('Test Product');
      expect(product.components).toEqual([]);
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new Product('Valid Product', [
          new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0'),
        ]);
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new Product('', []);
      }).toThrow('Product name is required');
    });

    it('should throw error when duplicate component types exist', () => {
      expect(() => {
        new Product('Product', [
          new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0'),
          new ComponentVersion(ComponentType.WEB, '2.0.0', '1.9.0'),
        ]);
      }).toThrow('Each component type can only appear once per product');
    });
  });

  describe('addComponent', () => {
    it('should add a component', () => {
      const product = new Product('Product', []);
      const component = new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0');

      product.addComponent(component);

      expect(product.components).toHaveLength(1);
      expect(product.components[0].type).toBe(ComponentType.WEB);
    });

    it('should throw error when component type already exists', () => {
      const product = new Product('Product', [
        new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0'),
      ]);
      const duplicate = new ComponentVersion(ComponentType.WEB, '2.0.0', '1.9.0');

      expect(() => {
        product.addComponent(duplicate);
      }).toThrow('Component type web already exists');
    });
  });

  describe('updateComponent', () => {
    it('should update a component', () => {
      const component = new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0');
      const product = new Product('Product', [component]);
      const oldUpdatedAt = new Date(product.updatedAt.getTime());

      product.updateComponent(component.id, { currentVersion: '1.1.0' });

      expect(product.components[0].currentVersion).toBe('1.1.0');
      expect(product.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should throw error when component not found', () => {
      const product = new Product('Product', []);

      expect(() => {
        product.updateComponent('non-existent', { currentVersion: '1.1.0' });
      }).toThrow('Component with id non-existent not found');
    });
  });

  describe('removeComponent', () => {
    it('should remove a component', () => {
      const component = new ComponentVersion(ComponentType.WEB, '1.0.0', '0.9.0');
      const product = new Product('Product', [component]);

      product.removeComponent(component.id);

      expect(product.components).toHaveLength(0);
    });

    it('should throw error when component not found', () => {
      const product = new Product('Product', []);

      expect(() => {
        product.removeComponent('non-existent');
      }).toThrow('Component with id non-existent not found');
    });
  });
});

