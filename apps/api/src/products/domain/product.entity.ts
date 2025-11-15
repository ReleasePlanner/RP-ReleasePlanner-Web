/**
 * Product Entity (TypeORM)
 */
import { Entity, Column, OneToMany, Index } from "typeorm";
import { BaseEntity } from "../../common/database/base.entity";
import type { ComponentType } from "./component-version.entity";

// Type for ComponentVersion to avoid circular dependency
// This type matches the actual ComponentVersion entity structure
type ComponentVersion = {
  id: string;
  type: ComponentType;
  currentVersion: string;
  previousVersion: string;
  productId: string;
  product?: Product;
  touch?: () => void;
  createdAt: Date;
  updatedAt: Date;
};

type ComponentVersionUpdates = Partial<{
  type: ComponentType;
  currentVersion: string;
  previousVersion: string;
}>;

@Entity("products")
@Index(["name"], { unique: true })
export class Product extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @OneToMany(
    () => require("./component-version.entity").ComponentVersion,
    (component: ComponentVersion) => component.product,
    {
      cascade: true,
      eager: false,
      orphanRemoval: true,
    }
  )
  components?: ComponentVersion[];

  constructor(name?: string, components?: ComponentVersion[]) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (components !== undefined) {
      this.components = components;
    }
    // Don't initialize components array - TypeORM will handle it
    if (name !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Product name is required");
    }
    // Business rule: Each component type must be unique
    if (this.components && this.components.length > 0) {
      const types = this.components.map((c) => c.type);
      const uniqueTypes = new Set(types);
      if (types.length !== uniqueTypes.size) {
        throw new Error("Each component type can only appear once per product");
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
  updateComponent(componentId: string, updates: ComponentVersionUpdates): void {
    if (!this.components) {
      throw new Error("No components available");
    }
    const component = this.components.find((c) => c.id === componentId);
    if (!component) {
      throw new Error(`Component with id ${componentId} not found`);
    }
    Object.assign(component, updates);
    if (component.touch) {
      component.touch();
    }
    this.touch();
  }

  /**
   * Remove a component
   */
  removeComponent(componentId: string): void {
    if (!this.components) {
      throw new Error("No components available");
    }
    const index = this.components.findIndex((c) => c.id === componentId);
    if (index === -1) {
      throw new Error(`Component with id ${componentId} not found`);
    }
    this.components.splice(index, 1);
    this.touch();
  }
}
