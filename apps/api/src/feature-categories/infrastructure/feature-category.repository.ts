/**
 * Feature Category Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { FeatureCategory } from '../domain/feature-category.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IFeatureCategoryRepository extends IRepository<FeatureCategory> {
  findByName(name: string): Promise<FeatureCategory | null>;
}

@Injectable()
export class FeatureCategoryRepository
  extends BaseRepository<FeatureCategory>
  implements IFeatureCategoryRepository
{
  constructor(
    @InjectRepository(FeatureCategory)
    repository: Repository<FeatureCategory>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<FeatureCategory | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }
}

