/**
 * Component Version Entity (TypeORM)
 */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { Product } from './product.entity';

export enum ComponentType {
  WEB = 'web',
  SERVICES = 'services',
  MOBILE = 'mobile',
}

@Entity('component_versions')
export class ComponentVersion extends BaseEntity {
  @Column({ type: 'enum', enum: ComponentType })
  type: ComponentType;

  @Column({ type: 'varchar', length: 50 })
  currentVersion: string;

  @Column({ type: 'varchar', length: 50 })
  previousVersion: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.components, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  validate(): void {
    if (!Object.values(ComponentType).includes(this.type)) {
      throw new Error(`Invalid component type: ${this.type}`);
    }
    if (!this.currentVersion || this.currentVersion.trim().length === 0) {
      throw new Error('Current version is required');
    }
    if (!this.previousVersion || this.previousVersion.trim().length === 0) {
      throw new Error('Previous version is required');
    }
  }
}
