/**
 * Base Phase Entity
 * 
 * Domain entity representing a base phase template
 */
import { BaseEntity } from '../../common/base/base.entity';

export class BasePhase extends BaseEntity {
  name: string;
  color: string;
  category?: string;

  constructor(name: string, color: string, category?: string) {
    super();
    this.name = name;
    this.color = color;
    this.category = category;
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

