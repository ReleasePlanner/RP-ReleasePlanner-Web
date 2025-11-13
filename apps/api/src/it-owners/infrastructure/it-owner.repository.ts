/**
 * IT Owner Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { ITOwner } from '../domain/it-owner.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IITOwnerRepository extends IRepository<ITOwner> {
  findByName(name: string): Promise<ITOwner | null>;
}

@Injectable()
export class ITOwnerRepository
  extends BaseRepository<ITOwner>
  implements IITOwnerRepository
{
  constructor(
    @InjectRepository(ITOwner)
    repository: Repository<ITOwner>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<ITOwner | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }
}
