import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('feature_categories')
@Index(['name'], { unique: true })
export class FeatureCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Category name is required');
    }
  }
}
