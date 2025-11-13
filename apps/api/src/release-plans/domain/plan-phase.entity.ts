import { BaseEntity } from '../../common/base/base.entity';

export class PlanPhase extends BaseEntity {
  name: string;
  startDate?: string; // ISO date (YYYY-MM-DD)
  endDate?: string; // ISO date (YYYY-MM-DD)
  color?: string;

  constructor(name: string, startDate?: string, endDate?: string, color?: string) {
    super();
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.color = color;
    this.validate();
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Phase name is required');
    }
    if (this.startDate && this.endDate) {
      if (new Date(this.startDate) > new Date(this.endDate)) {
        throw new Error('Start date must be before or equal to end date');
      }
    }
    if (this.color && !this.isValidColor(this.color)) {
      throw new Error('Invalid color format. Must be a valid hex color');
    }
  }

  private isValidColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
}

