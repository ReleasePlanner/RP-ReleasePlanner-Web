/**
 * Component Type Entity (TypeORM)
 */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('component_types')
@Index(['name'], { unique: true })
export class ComponentType extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  code?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  constructor(name?: string, code?: string, description?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (code !== undefined) {
      this.code = code;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (name !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Component type name is required');
    }
  }
}

