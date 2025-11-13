import { BaseEntity } from '../../common/base/base.entity';

export class PlanMilestone extends BaseEntity {
  date: string; // ISO date (YYYY-MM-DD)
  name: string;
  description?: string;

  constructor(date: string, name: string, description?: string) {
    super();
    this.date = date;
    this.name = name;
    this.description = description;
    this.validate();
  }

  validate(): void {
    if (!this.date || !this.isValidDate(this.date)) {
      throw new Error('Valid date in YYYY-MM-DD format is required');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Milestone name is required');
    }
  }

  private isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) {
      return false;
    }
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }
}

