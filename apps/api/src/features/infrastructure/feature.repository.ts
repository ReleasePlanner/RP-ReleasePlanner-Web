/**
 * Feature Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Feature } from '../domain/feature.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { validateString, validateId } from '@rp-release-planner/rp-shared';

export interface IFeatureRepository extends IRepository<Feature> {
  findByProductId(productId: string): Promise<Feature[]>;
  findByStatus(status: string): Promise<Feature[]>;
  findByName(name: string): Promise<Feature | null>;
}

@Injectable()
export class FeatureRepository
  extends BaseRepository<Feature>
  implements IFeatureRepository
{
  constructor(
    @InjectRepository(Feature)
    repository: Repository<Feature>,
  ) {
    super(repository);
  }

  async findByProductId(productId: string): Promise<Feature[]> {
    // Defensive: Validate product ID before query
    validateId(productId, 'Product');
    
    return this.handleDatabaseOperation(
      () => this.repository.find({
        where: { productId } as any,
        relations: ['category', 'createdBy', 'country'],
      }),
      `findByProductId(${productId})`,
    );
  }

  async findByStatus(status: string): Promise<Feature[]> {
    // Defensive: Validate status before query
    validateString(status, 'Feature status');
    
    return this.handleDatabaseOperation(
      () => this.repository.find({
        where: { status: status as any } as any,
        relations: ['category', 'createdBy', 'country'],
      }),
      `findByStatus(${status})`,
    );
  }

  async findByName(name: string): Promise<Feature | null> {
    // Defensive: Validate name before query
    validateString(name, 'Feature name');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { name } as any,
      }),
      `findByName(${name})`,
    );
  }
}
