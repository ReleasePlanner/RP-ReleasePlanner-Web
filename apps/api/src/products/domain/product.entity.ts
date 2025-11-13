/**
 * Product Entity (TypeORM)
 */
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { ComponentVersion } from './component-version.entity';

@Entity('products')
@Index(['name'], { unique: true })
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => ComponentVersion, (component) => component.product, {
    cascade: true,
    eager: false,
  })
  components: ComponentVersion[];

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    // Business rule: Each component type must be unique
    if (this.components && this.components.length > 0) {
      const types = this.components.map((c) => c.type);
      const uniqueTypes = new Set(types);
      if (types.length !== uniqueTypes.size) {
        throw new Error('Each component type can only appear once per product');
      }
    }
  }

  /**
   * Add a component to the product
   */
  addComponent(component: ComponentVersion): void {
    if (!this.components) {
      this.components = [];
    }
    const existing = this.components.find((c) => c.type === component.type);
    if (existing) {
      throw new Error(`Component type ${component.type} already exists`);
    }
    component.productId = this.id;
    this.components.push(component);
    this.touch();
  }

  /**
   * Update a component
   */
  updateComponent(componentId: string, updates: Partial<ComponentVersion>): void {
    if (!this.components) {
      throw new Error('No components available');
    }
    const component = this.components.find((c) => c.id === componentId);
    if (!component) {
      throw new Error(`Component with id ${componentId} not found`);
    }
    Object.assign(component, updates);
    component.touch();
    this.touch();
  }

  /**
   * Remove a component
   */
  removeComponent(componentId: string): void {
    if (!this.components) {
      throw new Error('No components available');
    }
    const index = this.components.findIndex((c) => c.id === componentId);
    if (index === -1) {
      throw new Error(`Component with id ${componentId} not found`);
    }
    this.components.splice(index, 1);
    this.touch();
  }
}
