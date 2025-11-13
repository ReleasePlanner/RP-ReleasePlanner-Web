/**
 * Generic Repository Interface
 * 
 * Base interface for all repositories following Repository Pattern
 * Provides common CRUD operations
 */
export interface IRepository<T, ID = string> {
  /**
   * Find all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Find entity by ID
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find entities by criteria
   */
  findMany(criteria: Partial<T>): Promise<T[]>;

  /**
   * Create a new entity
   */
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;

  /**
   * Update an existing entity
   */
  update(id: ID, updates: Partial<T>): Promise<T>;

  /**
   * Delete an entity by ID
   */
  delete(id: ID): Promise<void>;

  /**
   * Check if entity exists
   */
  exists(id: ID): Promise<boolean>;

  /**
   * Count entities
   */
  count(criteria?: Partial<T>): Promise<number>;
}

