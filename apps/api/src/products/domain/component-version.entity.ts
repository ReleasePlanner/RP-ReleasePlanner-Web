/**
 * Product Component Version Entity (TypeORM)
 * Previously named ComponentVersion, renamed to ProductComponentVersion
 */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { ProductComponent } from '../../component-types/domain/component-type.entity';

// Keep enum for backward compatibility during migration
export enum ComponentTypeEnum {
  WEB = 'web',
  SERVICES = 'services',
  MOBILE = 'mobile',
}

@Entity('product_components')
export class ProductComponentVersion extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'uuid', nullable: true })
  componentTypeId?: string;

  @ManyToOne(() => ProductComponent, { eager: true, nullable: true })
  @JoinColumn({ name: 'componentTypeId' })
  componentType?: ProductComponent;

  @Column({ type: 'varchar', length: 50 })
  currentVersion: string;

  @Column({ type: 'varchar', length: 50 })
  previousVersion: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => require('./product.entity').Product, (product: any) => product.components, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: any;

  constructor(
    componentType?: ProductComponent | string,
    currentVersion?: string,
    previousVersion?: string,
    name?: string
  ) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    
    // Handle ProductComponent entity or componentTypeId string
    if (componentType !== undefined) {
      if (componentType instanceof ProductComponent) {
        // ProductComponent entity
        this.componentType = componentType;
        this.componentTypeId = componentType.id;
      } else if (typeof componentType === 'string') {
        // String value - treat as componentTypeId
        this.componentTypeId = componentType;
      }
    }
    
    if (currentVersion !== undefined) {
      this.currentVersion = currentVersion;
    }
    if (previousVersion !== undefined) {
      this.previousVersion = previousVersion;
    }
    if (currentVersion !== undefined && previousVersion !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    // Validate componentTypeId is required
    if (!this.componentTypeId) {
      throw new Error('Component type is required (componentTypeId must be provided)');
    }
    
    if (!this.currentVersion || this.currentVersion.trim().length === 0) {
      throw new Error('Current version is required');
    }
    if (!this.previousVersion || this.previousVersion.trim().length === 0) {
      throw new Error('Previous version is required');
    }
  }

  // Helper method to get type code
  getTypeCode(): string {
    if (this.componentType?.code) {
      return this.componentType.code;
    }
    return '';
  }
}
