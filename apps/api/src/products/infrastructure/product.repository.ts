/**
 * Product Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Product } from '../domain/product.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IProductRepository extends IRepository<Product> {
  findByName(name: string): Promise<Product | null>;
  findWithComponents(id: string): Promise<Product | null>;
}

@Injectable()
export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }

  async findWithComponents(id: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: ['components'],
    });
  }

  override async findById(id: string): Promise<Product | null> {
    return this.findWithComponents(id);
  }
}
