/**
 * Base Repository Implementation
 *
 * In-memory implementation for development
 * In production, this would be replaced with database-specific implementations
 */
import { IRepository } from "../interfaces/repository.interface";
import { BaseEntity } from "./base.entity";

export abstract class BaseRepository<T extends BaseEntity, ID = string>
  implements IRepository<T, ID>
{
  protected readonly entities: Map<ID, T> = new Map();

  async findAll(): Promise<T[]> {
    return Array.from(this.entities.values());
  }

  async findById(id: ID): Promise<T | null> {
    return this.entities.get(id) || null;
  }

  async findMany(criteria: Partial<T>): Promise<T[]> {
    const all = await this.findAll();
    return all.filter((entity) => {
      return Object.keys(criteria).every((key) => {
        const value = criteria[key as keyof T];
        return entity[key as keyof T] === value;
      });
    });
  }

  async create(
    entityData: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<T> {
    const entity = entityData as T & { id?: string; createdAt?: Date; updatedAt?: Date };
    if (!entity.id) {
      entity.id = this.generateId() as ID & string;
    }
    if (!entity.createdAt) {
      entity.createdAt = new Date();
    }
    if (!entity.updatedAt) {
      entity.updatedAt = new Date();
    }

    this.entities.set(entity.id as ID, entity as T);
    return entity as T;
  }

  async update(id: ID, updates: Partial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }

    Object.assign(entity, updates);
    (entity as T & { updatedAt: Date }).updatedAt = new Date();

    this.entities.set(id, entity);
    return entity;
  }

  async delete(id: ID): Promise<void> {
    const exists = await this.exists(id);
    if (!exists) {
      throw new Error(`Entity with id ${id} not found`);
    }
    this.entities.delete(id);
  }

  async exists(id: ID): Promise<boolean> {
    return this.entities.has(id);
  }

  async count(criteria?: Partial<T>): Promise<number> {
    if (!criteria) {
      return this.entities.size;
    }
    const filtered = await this.findMany(criteria);
    return filtered.length;
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
