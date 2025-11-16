import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

/**
 * Plan Component Version Entity
 * Stores historical record of component version changes for each plan
 * This allows tracking how component versions evolved over time
 */
@Entity('plan_component_versions')
@Index(['planId'])
@Index(['productId'])
@Index(['componentId'])
@Index(['planId', 'componentId']) // Composite index for faster lookups
export class PlanComponentVersion extends BaseEntity {
  @Column({ type: 'uuid' })
  planId: string;

  @Column({ type: 'varchar', length: 255 })
  productId: string;

  @Column({ type: 'uuid' })
  componentId: string;

  @Column({ type: 'varchar', length: 50 })
  oldVersion: string; // Version before the change

  @Column({ type: 'varchar', length: 50 })
  newVersion: string; // Version after the change

  @ManyToOne(() => require('./plan.entity').Plan, (plan: any) => plan.componentVersions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: any;

  constructor(
    planId?: string,
    productId?: string,
    componentId?: string,
    oldVersion?: string,
    newVersion?: string,
  ) {
    super();
    if (planId !== undefined) {
      this.planId = planId;
    }
    if (productId !== undefined) {
      this.productId = productId;
    }
    if (componentId !== undefined) {
      this.componentId = componentId;
    }
    if (oldVersion !== undefined) {
      this.oldVersion = oldVersion;
    }
    if (newVersion !== undefined) {
      this.newVersion = newVersion;
    }
    if (planId !== undefined && productId !== undefined && componentId !== undefined && oldVersion !== undefined && newVersion !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.planId) {
      throw new Error('Plan ID is required');
    }
    if (!this.productId) {
      throw new Error('Product ID is required');
    }
    if (!this.componentId) {
      throw new Error('Component ID is required');
    }
    if (!this.oldVersion || this.oldVersion.trim().length === 0) {
      throw new Error('Old version is required');
    }
    if (!this.newVersion || this.newVersion.trim().length === 0) {
      throw new Error('New version is required');
    }
  }
}

