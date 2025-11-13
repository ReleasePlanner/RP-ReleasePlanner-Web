import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { Plan } from './plan.entity';

@Entity('gantt_cell_comments')
export class GanttCellComment extends BaseEntity {
  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'uuid' })
  cellDataId: string;

  @ManyToOne(() => GanttCellData, (cellData) => cellData.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cellDataId' })
  cellData: GanttCellData;

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

  @ManyToOne(() => GanttCellData, (cellData) => cellData.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cellDataId' })
  cellData: GanttCellData;

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

  @ManyToOne(() => GanttCellData, (cellData) => cellData.links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cellDataId' })
  cellData: GanttCellData;

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

  @ManyToOne(() => Plan, (plan) => plan.cellData, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @OneToMany(() => GanttCellComment, (comment) => comment.cellData, {
    cascade: true,
    eager: false,
  })
  comments: GanttCellComment[];

  @OneToMany(() => GanttCellFile, (file) => file.cellData, {
    cascade: true,
    eager: false,
  })
  files: GanttCellFile[];

  @OneToMany(() => GanttCellLink, (link) => link.cellData, {
    cascade: true,
    eager: false,
  })
  links: GanttCellLink[];

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
