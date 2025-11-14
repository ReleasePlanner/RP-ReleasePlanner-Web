/**
 * Product Response DTO Tests
 * Coverage: 100%
 */
import { ComponentVersion, ComponentType } from '../../domain/component-version.entity';
import { Product } from '../../domain/product.entity';
import { ComponentVersionResponseDto, ProductResponseDto } from './product-response.dto';

describe('ProductResponseDto', () => {
  describe('ComponentVersionResponseDto', () => {
    it('should create DTO from entity', () => {
      const component = new ComponentVersion(ComponentType.WEB, '1.2.3', '1.2.2');
      component.id = 'comp-id';
      component.createdAt = new Date();
      component.updatedAt = new Date();

      const dto = new ComponentVersionResponseDto(component);

      expect(dto.id).toBe('comp-id');
      expect(dto.type).toBe(ComponentType.WEB);
      expect(dto.currentVersion).toBe('1.2.3');
      expect(dto.previousVersion).toBe('1.2.2');
      expect(dto.createdAt).toBe(component.createdAt);
      expect(dto.updatedAt).toBe(component.updatedAt);
    });
  });

  describe('ProductResponseDto', () => {
    it('should create DTO from product entity with components', () => {
      const component1 = new ComponentVersion(ComponentType.WEB, '1.2.3', '1.2.2');
      component1.id = 'comp-1';
      component1.createdAt = new Date();
      component1.updatedAt = new Date();

      const component2 = new ComponentVersion(ComponentType.MOBILE, '2.0.0', '1.9.9');
      component2.id = 'comp-2';
      component2.createdAt = new Date();
      component2.updatedAt = new Date();

      const product = new Product('Product 1', [component1, component2]);
      product.id = 'product-id';
      product.createdAt = new Date();
      product.updatedAt = new Date();

      const dto = new ProductResponseDto(product);

      expect(dto.id).toBe('product-id');
      expect(dto.name).toBe('Product 1');
      expect(dto.components).toHaveLength(2);
      expect(dto.components[0].id).toBe('comp-1');
      expect(dto.components[0].type).toBe(ComponentType.WEB);
      expect(dto.components[1].id).toBe('comp-2');
      expect(dto.components[1].type).toBe(ComponentType.MOBILE);
      expect(dto.createdAt).toBe(product.createdAt);
      expect(dto.updatedAt).toBe(product.updatedAt);
    });

    it('should handle empty components array', () => {
      const product = new Product('Product 1');
      product.id = 'product-id';
      product.components = [];
      product.createdAt = new Date();
      product.updatedAt = new Date();

      const dto = new ProductResponseDto(product);

      expect(dto.components).toEqual([]);
    });
  });
});

