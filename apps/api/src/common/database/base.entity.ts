/**
 * Base Entity for TypeORM
 * 
 * Common fields and decorators for all database entities
 */
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  constructor() {
    super();
    // Initialize properties for testing (TypeORM will override these when persisting)
    if (!this.id) {
      this.id = this.generateUUID();
    }
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
  }

  /**
   * Generate a UUID v4 for testing purposes
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Update the updatedAt timestamp manually if needed
   */
  touch(): void {
    this.updatedAt = new Date();
  }
}

