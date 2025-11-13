import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/base/base.repository';
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
  async findByName(name: string): Promise<ITOwner | null> {
    const owners = await this.findAll();
    return owners.find((o) => o.name.toLowerCase() === name.toLowerCase()) || null;
  }
}

