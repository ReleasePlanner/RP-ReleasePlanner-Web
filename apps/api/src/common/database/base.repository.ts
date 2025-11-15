/**
 * Base Repository Implementation using TypeORM
 * 
 * Provides common CRUD operations using TypeORM Repository pattern
 * with proper error handling and resilience
 */
import { Repository, FindOptionsWhere, FindManyOptions, QueryFailedError } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { IRepository } from '../interfaces/repository.interface';
import { BaseEntity } from './base.entity';
import { DatabaseException } from '../exceptions/database-exception';
import { NotFoundException } from '../exceptions/business-exception';
import { validateId, validateObject } from '@rp-release-planner/rp-shared';

@Injectable()
export abstract class BaseRepository<T extends BaseEntity, ID = string>
  implements IRepository<T, ID>
{
  protected readonly logger: Logger;

  constructor(protected readonly repository: Repository<T>) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Wrap database operations with error handling
   */
  protected async handleDatabaseOperation<R>(
    operation: () => Promise<R>,
    operationName: string,
  ): Promise<R> {
    try {
      return await operation();
    } catch (error) {
      this.logger.error(
        `Database operation failed: ${operationName}`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );

      if (error instanceof QueryFailedError) {
        throw DatabaseException.fromTypeORMError(error);
      }

      if (error instanceof DatabaseException || error instanceof NotFoundException) {
        throw error;
      }

      // Wrap unknown errors
      throw new DatabaseException(
        `Database operation failed: ${operationName}`,
        undefined,
        'DATABASE_ERROR',
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  async findAll(): Promise<T[]> {
    return this.handleDatabaseOperation(
      () => this.repository.find(),
      'findAll',
    );
  }

  async findById(id: ID): Promise<T | null> {
    // Defensive: Validate ID before query
    if (typeof id === 'string') {
      validateId(id, 'Entity');
    } else if (id === null || id === undefined) {
      throw new Error('ID cannot be null or undefined');
    }
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { id } as FindOptionsWhere<T>,
      }),
      `findById(${id})`,
    );
  }

  async findMany(criteria: Partial<T>): Promise<T[]> {
    // Defensive: Validate criteria
    if (criteria === null || criteria === undefined) {
      throw new Error('Criteria cannot be null or undefined');
    }
    
    return this.handleDatabaseOperation(
      () => {
        const options: FindManyOptions<T> = {
          where: criteria as FindOptionsWhere<T>,
        };
        return this.repository.find(options);
      },
      'findMany',
    );
  }

  async create(entityData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    // Defensive: Validate entity data
    validateObject(entityData, 'Entity data');
    
    return this.handleDatabaseOperation(
      async () => {
        const entity = this.repository.create(entityData as T);
        if (!entity) {
          throw new Error('Failed to create entity');
        }
        const saved = await this.repository.save(entity);
        if (!saved) {
          throw new Error('Failed to save entity');
        }
        return saved;
      },
      'create',
    );
  }

  async update(id: ID, updates: Partial<T>): Promise<T> {
    // Defensive: Validate inputs
    if (typeof id === 'string') {
      validateId(id, 'Entity');
    } else if (id === null || id === undefined) {
      throw new Error('ID cannot be null or undefined');
    }
    if (updates === null || updates === undefined) {
      throw new Error('Updates cannot be null or undefined');
    }
    
    return this.handleDatabaseOperation(
      async () => {
        const entity = await this.repository.findOne({
          where: { id } as FindOptionsWhere<T>,
        });
        
        if (!entity) {
          throw new NotFoundException('Entity', String(id));
        }

        Object.assign(entity, updates);
        const saved = await this.repository.save(entity);
        if (!saved) {
          throw new Error('Failed to save updated entity');
        }
        return saved;
      },
      `update(${id})`,
    );
  }

  async delete(id: ID): Promise<void> {
    // Defensive: Validate ID
    if (typeof id === 'string') {
      validateId(id, 'Entity');
    } else if (id === null || id === undefined) {
      throw new Error('ID cannot be null or undefined');
    }
    
    return this.handleDatabaseOperation(
      async () => {
        const result = await this.repository.delete(id as any);
        if (result.affected === 0) {
          throw new NotFoundException('Entity', String(id));
        }
      },
      `delete(${id})`,
    );
  }

  async exists(id: ID): Promise<boolean> {
    // Defensive: Validate ID
    if (typeof id === 'string') {
      validateId(id, 'Entity');
    } else if (id === null || id === undefined) {
      return false;
    }
    
    return this.handleDatabaseOperation(
      () => this.repository.count({
        where: { id } as FindOptionsWhere<T>,
      }).then(count => count > 0),
      `exists(${id})`,
    );
  }

  async count(criteria?: Partial<T>): Promise<number> {
    return this.handleDatabaseOperation(
      () => {
        if (!criteria) {
          return this.repository.count();
        }
        return this.repository.count({
          where: criteria as FindOptionsWhere<T>,
        });
      },
      'count',
    );
  }

  /**
   * Save entity (useful for complex operations)
   */
  async save(entity: T): Promise<T> {
    // Defensive: Validate entity
    validateObject(entity, 'Entity');
    
    return this.handleDatabaseOperation(
      async () => {
        const saved = await this.repository.save(entity);
        if (!saved) {
          throw new Error('Failed to save entity');
        }
        return saved;
      },
      'save',
    );
  }

  /**
   * Find one by criteria
   */
  async findOne(criteria: Partial<T>): Promise<T | null> {
    // Defensive: Validate criteria
    if (criteria === null || criteria === undefined) {
      throw new Error('Criteria cannot be null or undefined');
    }
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: criteria as FindOptionsWhere<T>,
      }),
      'findOne',
    );
  }
}

