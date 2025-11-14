import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { FeatureCategory } from './feature-category.entity';
import { ProductOwner } from './product-owner.entity';

export enum FeatureStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold',
}

@Entity('features')
export class Feature extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => FeatureCategory, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: FeatureCategory;

  @Column({ type: 'enum', enum: FeatureStatus, default: FeatureStatus.PLANNED })
  status: FeatureStatus;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => ProductOwner, { eager: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: ProductOwner;

  @Column({ type: 'text' })
  technicalDescription: string;

  @Column({ type: 'text' })
  businessDescription: string;

  @Column({ type: 'uuid' })
  @Index()
  productId: string;

  constructor(
    name?: string,
    description?: string,
    category?: FeatureCategory,
    status?: FeatureStatus,
    createdBy?: ProductOwner,
    technicalDescription?: string,
    businessDescription?: string,
    productId?: string,
  ) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (category !== undefined) {
      this.category = category;
      this.categoryId = category.id;
    }
    if (status !== undefined) {
      this.status = status;
    }
    if (createdBy !== undefined) {
      this.createdBy = createdBy;
      this.createdById = createdBy.id;
    }
    if (technicalDescription !== undefined) {
      this.technicalDescription = technicalDescription;
    }
    if (businessDescription !== undefined) {
      this.businessDescription = businessDescription;
    }
    if (productId !== undefined) {
      this.productId = productId;
    }
    if (name !== undefined && description !== undefined && productId !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Feature name is required');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Feature description is required');
    }
    if (!this.productId || this.productId.trim().length === 0) {
      throw new Error('Product ID is required');
    }
    if (!Object.values(FeatureStatus).includes(this.status)) {
      throw new Error(`Invalid feature status: ${this.status}`);
    }
  }
}
