import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/base/base.repository';
import { Feature } from '../domain/feature.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IFeatureRepository extends IRepository<Feature> {
  findByProductId(productId: string): Promise<Feature[]>;
  findByName(name: string): Promise<Feature | null>;
}

@Injectable()
export class FeatureRepository
  extends BaseRepository<Feature>
  implements IFeatureRepository
{
  async findByProductId(productId: string): Promise<Feature[]> {
    return this.findMany({ productId } as Partial<Feature>);
  }

  async findByName(name: string): Promise<Feature | null> {
    const features = await this.findAll();
    return features.find((f) => f.name.toLowerCase() === name.toLowerCase()) || null;
  }
}

