/**
 * Component Version Entity (TypeORM)
 */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { ComponentType } from '../../component-types/domain/component-type.entity';

// Keep enum for backward compatibility during migration
export enum ComponentTypeEnum {
  WEB = 'web',
  SERVICES = 'services',
  MOBILE = 'mobile',
}

@Entity('component_versions')
export class ComponentVersion extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  // Keep enum column for backward compatibility
  @Column({ type: 'enum', enum: ComponentTypeEnum, nullable: true })
  type?: ComponentTypeEnum;

  @Column({ type: 'uuid', nullable: true })
  componentTypeId?: string;

  @ManyToOne(() => ComponentType, { eager: true, nullable: true })
  @JoinColumn({ name: 'componentTypeId' })
  componentType?: ComponentType;

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
    typeOrComponentType?: ComponentTypeEnum | ComponentType | string,
    currentVersion?: string,
    previousVersion?: string,
    name?: string
  ) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    
    // Handle both enum and ComponentType entity
    if (typeOrComponentType !== undefined) {
      if (typeof typeOrComponentType === 'string') {
        // String value - treat as enum
        this.type = typeOrComponentType as ComponentTypeEnum;
      } else if (typeOrComponentType instanceof ComponentType) {
        // ComponentType entity
        this.componentType = typeOrComponentType;
        this.componentTypeId = typeOrComponentType.id;
        // Also set enum for backward compatibility
        this.type = typeOrComponentType.code as ComponentTypeEnum;
      } else {
        // Enum value
        this.type = typeOrComponentType;
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
    // Validate componentTypeId or type (for backward compatibility)
    if (!this.componentTypeId && !this.type) {
      throw new Error('Component type is required');
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
    if (this.type) {
      return this.type;
    }
    return '';
  }
}
