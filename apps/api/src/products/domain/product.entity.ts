/**
 * Product Entity
 */
import { BaseEntity } from '../../common/base/base.entity';
import { ComponentVersion } from './component-version.entity';

export class Product extends BaseEntity {
  name: string;
  components: ComponentVersion[];

  constructor(name: string, components: ComponentVersion[] = []) {
    super();
    this.name = name;
    this.components = components;
    this.validate();
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    // Business rule: Each component type must be unique
    const types = this.components.map((c) => c.type);
    const uniqueTypes = new Set(types);
    if (types.length !== uniqueTypes.size) {
      throw new Error('Each component type can only appear once per product');
    }
  }

  /**
   * Add a component to the product
   */
  addComponent(component: ComponentVersion): void {
    const existing = this.components.find((c) => c.type === component.type);
    if (existing) {
      throw new Error(`Component type ${component.type} already exists`);
    }
    this.components.push(component);
    this.touch();
  }

  /**
   * Update a component
   */
  updateComponent(componentId: string, updates: Partial<ComponentVersion>): void {
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
    const index = this.components.findIndex((c) => c.id === componentId);
    if (index === -1) {
      throw new Error(`Component with id ${componentId} not found`);
    }
    this.components.splice(index, 1);
    this.touch();
  }
}

