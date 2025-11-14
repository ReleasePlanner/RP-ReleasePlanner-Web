import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

export enum PlanReferenceType {
  LINK = 'link',
  DOCUMENT = 'document',
  NOTE = 'note',
  COMMENT = 'comment',
  FILE = 'file',
  MILESTONE = 'milestone',
}

@Entity('plan_references')
@Index(['planId'])
export class PlanReference extends BaseEntity {
  @Column({ type: 'enum', enum: PlanReferenceType })
  type: PlanReferenceType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  url?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date', nullable: true })
  date?: string; // ISO date (YYYY-MM-DD)

  @Column({ type: 'uuid', nullable: true })
  phaseId?: string;

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => require('../../release-plans/domain/plan.entity').Plan, (plan: any) => plan.references, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'planId' })
  plan: any;

  constructor(
    type?: PlanReferenceType,
    title?: string,
    url?: string,
    description?: string,
    date?: string,
    phaseId?: string,
  ) {
    super();
    if (type !== undefined) {
      this.type = type;
    }
    if (title !== undefined) {
      this.title = title;
    }
    if (url !== undefined) {
      this.url = url;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (date !== undefined) {
      this.date = date;
    }
    if (phaseId !== undefined) {
      this.phaseId = phaseId;
    }
    if (type !== undefined && title !== undefined) {
      this.validate();
    }
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
