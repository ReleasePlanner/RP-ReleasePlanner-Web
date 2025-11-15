/**
 * Base Phase Entity (TypeORM)
 * 
 * Domain entity representing a base phase template
 */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('base_phases')
@Index(['name'], { unique: true })
@Index(['color'], { unique: true })
export class BasePhase extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 7 })
  color: string;

  constructor(name?: string, color?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (color !== undefined) {
      this.color = color;
    }
    // Don't validate automatically - allow invalid instances for testing
    // Validation should be called explicitly when needed
  }

  /**
   * Business rule: Phase name must be unique
   */
  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Phase name is required');
    }
    if (!this.color || this.color.trim().length === 0) {
      throw new Error('Phase color is required');
    }
    if (!this.isValidColor(this.color)) {
      throw new Error('Invalid color format. Must be a valid hex color');
    }
  }

  /**
   * Validate hex color format
   */
  private isValidColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
}
