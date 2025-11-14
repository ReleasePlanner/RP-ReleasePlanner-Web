import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('gantt_cell_comments')
export class GanttCellComment extends BaseEntity {
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'uuid' })
  cellDataId: string;

  @ManyToOne(() => require('../../release-plans/domain/gantt-cell-data.entity').GanttCellData, (cellData: any) => cellData.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cellDataId' })
  cellData: any;

  constructor(text?: string, author?: string) {
    super();
    if (text !== undefined) {
      this.text = text;
    }
    if (author !== undefined) {
      this.author = author;
    }
    if (text !== undefined && author !== undefined) {
      this.validate();
    }
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

@Entity('gantt_cell_files')
export class GanttCellFile extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'bigint', nullable: true })
  size?: number; // bytes

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType?: string;

  @Column({ type: 'uuid' })
  cellDataId: string;

  @ManyToOne(() => require('../../release-plans/domain/gantt-cell-data.entity').GanttCellData, (cellData: any) => cellData.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cellDataId' })
  cellData: any;

  constructor(name?: string, url?: string, size?: number, mimeType?: string) {
    super();
    if (name !== undefined) {
      this.name = name;
    }
    if (url !== undefined) {
      this.url = url;
    }
    if (size !== undefined) {
      this.size = size;
    }
    if (mimeType !== undefined) {
      this.mimeType = mimeType;
    }
    if (name !== undefined && url !== undefined) {
      this.validate();
    }
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

@Entity('gantt_cell_links')
export class GanttCellLink extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  cellDataId: string;

  @ManyToOne(() => require('../../release-plans/domain/gantt-cell-data.entity').GanttCellData, (cellData: any) => cellData.links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cellDataId' })
  cellData: any;

  constructor(title?: string, url?: string, description?: string) {
    super();
    if (title !== undefined) {
      this.title = title;
    }
    if (url !== undefined) {
      this.url = url;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (title !== undefined && url !== undefined) {
      this.validate();
    }
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

@Entity('gantt_cell_data')
@Index(['planId', 'date'])
export class GanttCellData extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  phaseId?: string;

  @Column({ type: 'date' })
  date: string; // ISO date (YYYY-MM-DD)

  @Column({ type: 'boolean', default: false })
  isMilestone?: boolean;

  @Column({ type: 'varchar', length: 7, nullable: true })
  milestoneColor?: string;

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => require('../../release-plans/domain/plan.entity').Plan, (plan: any) => plan.cellData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: any;

  @OneToMany(() => GanttCellComment, (comment) => comment.cellData, {
    cascade: true,
    eager: false,
  })
  comments?: GanttCellComment[];

  @OneToMany(() => GanttCellFile, (file) => file.cellData, {
    cascade: true,
    eager: false,
  })
  files?: GanttCellFile[];

  @OneToMany(() => GanttCellLink, (link) => link.cellData, {
    cascade: true,
    eager: false,
  })
  links?: GanttCellLink[];

  constructor(date?: string, phaseId?: string, isMilestone?: boolean, milestoneColor?: string) {
    super();
    if (date !== undefined) {
      this.date = date;
    }
    if (phaseId !== undefined) {
      this.phaseId = phaseId;
    }
    if (isMilestone !== undefined) {
      this.isMilestone = isMilestone;
    }
    if (milestoneColor !== undefined) {
      this.milestoneColor = milestoneColor;
    }
    // Don't initialize TypeORM relations - TypeORM will handle them
    if (date !== undefined) {
      this.validate();
    }
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
