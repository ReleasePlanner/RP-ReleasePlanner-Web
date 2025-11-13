/**
 * Base Entity
 *
 * Common fields for all entities
 */
export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Generate a unique ID
   * In production, this would use UUID or database-generated IDs
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Update the updatedAt timestamp
   */
  touch(): void {
    this.updatedAt = new Date();
  }
}
