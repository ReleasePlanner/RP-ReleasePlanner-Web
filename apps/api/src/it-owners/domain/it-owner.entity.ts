/**
 * IT Owner Entity (TypeORM)
 */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('it_owners')
@Index(['name'], { unique: true })
export class ITOwner extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  constructor(name?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('IT Owner name is required');
    }
  }
}
