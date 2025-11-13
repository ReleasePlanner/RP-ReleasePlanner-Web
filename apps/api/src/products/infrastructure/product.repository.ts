/**
 * Product Repository
 */
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/base/base.repository';
import { Product } from '../domain/product.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IProductRepository extends IRepository<Product> {
  findByName(name: string): Promise<Product | null>;
}

@Injectable()
export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  async findByName(name: string): Promise<Product | null> {
    const products = await this.findAll();
    return products.find((p) => p.name.toLowerCase() === name.toLowerCase()) || null;
  }
}

