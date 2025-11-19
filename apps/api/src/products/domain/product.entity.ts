/**
 * Product Entity (TypeORM)
 */
import { Entity, Column, OneToMany, Index } from "typeorm";
import { BaseEntity } from "../../common/database/base.entity";
// ComponentTypeEnum is no longer used - components now use componentTypeId

// Type for ProductComponentVersion to avoid circular dependency
// This type matches the actual ProductComponentVersion entity structure
type ProductComponentVersion = {
  id: string;
  componentTypeId?: string;
  componentType?: { id: string; code?: string; name?: string };
  currentVersion: string;
  previousVersion: string;
  productId: string;
  product?: Product;
  touch?: () => void;
  createdAt: Date;
  updatedAt: Date;
};

type ProductComponentVersionUpdates = Partial<{
  componentTypeId?: string;
  currentVersion: string;
  previousVersion: string;
}>;

@Entity("products")
@Index(["name"], { unique: true })
export class Product extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  name: string;

  @OneToMany(
    () => require("./component-version.entity").ProductComponentVersion,
    (component: ProductComponentVersion) => component.product,
    {
      cascade: true,
      eager: false,
      orphanRemoval: true,
    }
  )
  components?: ProductComponentVersion[];

  constructor(name?: string, components?: ProductComponentVersion[]) {
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
      const componentTypeIds = this.components.map((c) => c.componentTypeId).filter(Boolean);
      const uniqueComponentTypeIds = new Set(componentTypeIds);
      if (componentTypeIds.length !== uniqueComponentTypeIds.size) {
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
    const existing = this.components.find((c) => c.componentTypeId === component.componentTypeId);
    if (existing) {
      throw new Error(`Component type with componentTypeId ${component.componentTypeId} already exists`);
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
