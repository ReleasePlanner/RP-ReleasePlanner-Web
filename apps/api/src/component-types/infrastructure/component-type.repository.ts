/**
 * Component Type Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { ComponentType } from '../domain/component-type.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IComponentTypeRepository extends IRepository<ComponentType> {
  findByName(name: string): Promise<ComponentType | null>;
  findByCode(code: string): Promise<ComponentType | null>;
}

@Injectable()
export class ComponentTypeRepository
  extends BaseRepository<ComponentType>
  implements IComponentTypeRepository
{
  constructor(
    @InjectRepository(ComponentType)
    repository: Repository<ComponentType>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<ComponentType | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }

  async findByCode(code: string): Promise<ComponentType | null> {
    return this.repository.findOne({
      where: { code } as any,
    });
  }
}

