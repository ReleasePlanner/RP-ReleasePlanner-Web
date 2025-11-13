import { BaseEntity } from '../../common/base/base.entity';

export class GanttCellComment extends BaseEntity {
  text: string;
  author: string;

  constructor(text: string, author: string) {
    super();
    this.text = text;
    this.author = author;
    this.validate();
  }

  validate(): void {
    if (!this.text || this.text.trim().length === 0) {
      throw new Error('Comment text is required');
    }
    if (!this.author || this.author.trim().length === 0) {
      throw new Error('Comment author is required');
    }
  }
}

export class GanttCellFile extends BaseEntity {
  name: string;
  url: string;
  size?: number; // bytes
  mimeType?: string;

  constructor(name: string, url: string, size?: number, mimeType?: string) {
    super();
    this.name = name;
    this.url = url;
    this.size = size;
    this.mimeType = mimeType;
    this.validate();
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('File name is required');
    }
    if (!this.url || this.url.trim().length === 0) {
      throw new Error('File URL is required');
    }
  }
}

export class GanttCellLink extends BaseEntity {
  title: string;
  url: string;
  description?: string;

  constructor(title: string, url: string, description?: string) {
    super();
    this.title = title;
    this.url = url;
    this.description = description;
    this.validate();
  }

  validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Link title is required');
    }
    if (!this.url || this.url.trim().length === 0) {
      throw new Error('Link URL is required');
    }
  }
}

export class GanttCellData extends BaseEntity {
  phaseId?: string;
  date: string; // ISO date (YYYY-MM-DD)
  isMilestone?: boolean;
  milestoneColor?: string;
  comments: GanttCellComment[];
  files: GanttCellFile[];
  links: GanttCellLink[];

  constructor(
    date: string,
    phaseId?: string,
    isMilestone?: boolean,
    milestoneColor?: string,
  ) {
    super();
    this.date = date;
    this.phaseId = phaseId;
    this.isMilestone = isMilestone;
    this.milestoneColor = milestoneColor;
    this.comments = [];
    this.files = [];
    this.links = [];
    this.validate();
  }

  validate(): void {
    if (!this.date || !this.isValidDate(this.date)) {
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

