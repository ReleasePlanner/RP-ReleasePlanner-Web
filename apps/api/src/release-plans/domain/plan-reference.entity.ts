import { BaseEntity } from '../../common/base/base.entity';

export enum PlanReferenceType {
  LINK = 'link',
  DOCUMENT = 'document',
  NOTE = 'note',
  COMMENT = 'comment',
  FILE = 'file',
  MILESTONE = 'milestone',
}

export class PlanReference extends BaseEntity {
  type: PlanReferenceType;
  title: string;
  url?: string;
  description?: string;
  date?: string; // ISO date (YYYY-MM-DD)
  phaseId?: string;

  constructor(
    type: PlanReferenceType,
    title: string,
    url?: string,
    description?: string,
    date?: string,
    phaseId?: string,
  ) {
    super();
    this.type = type;
    this.title = title;
    this.url = url;
    this.description = description;
    this.date = date;
    this.phaseId = phaseId;
    this.validate();
  }

  validate(): void {
    if (!Object.values(PlanReferenceType).includes(this.type)) {
      throw new Error(`Invalid reference type: ${this.type}`);
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Reference title is required');
    }
    if (
      (this.type === PlanReferenceType.LINK || this.type === PlanReferenceType.DOCUMENT) &&
      (!this.url || this.url.trim().length === 0)
    ) {
      throw new Error('URL is required for link and document types');
    }
    if (this.date && !this.isValidDate(this.date)) {
      throw new Error('Valid date in YYYY-MM-DD format is required');
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

