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

export interface IFeatureRepository extends IRepository<Feature> {
  findByProductId(productId: string): Promise<Feature[]>;
  findByStatus(status: string): Promise<Feature[]>;
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
    return this.repository.find({
      where: { productId } as any,
      relations: ['category', 'createdBy'],
    });
  }

  async findByStatus(status: string): Promise<Feature[]> {
    return this.repository.find({
      where: { status: status as any } as any,
      relations: ['category', 'createdBy'],
    });
  }
}
