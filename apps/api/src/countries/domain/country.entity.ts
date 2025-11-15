import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('countries')
@Index(['name'], { unique: true })
@Index(['code'], { unique: true })
export class Country extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  isoCode?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region?: string;

  constructor(name?: string, code?: string, isoCode?: string, region?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (code !== undefined) {
      this.code = code;
    }
    if (isoCode !== undefined) {
      this.isoCode = isoCode;
    }
    if (region !== undefined) {
      this.region = region;
    }
    if (name !== undefined && code !== undefined) {
      this.validate();
    }
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Country name is required');
    }
    if (!this.code || this.code.trim().length === 0) {
      throw new Error('Country code is required');
    }
  }
}

