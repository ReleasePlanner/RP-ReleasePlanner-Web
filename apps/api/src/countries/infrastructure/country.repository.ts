/**
 * Country Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Country } from '../domain/country.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface ICountryRepository extends IRepository<Country> {
  findByName(name: string): Promise<Country | null>;
  findByCode(code: string): Promise<Country | null>;
}

@Injectable()
export class CountryRepository
  extends BaseRepository<Country>
  implements ICountryRepository
{
  constructor(
    @InjectRepository(Country)
    repository: Repository<Country>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Country | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }

  async findByCode(code: string): Promise<Country | null> {
    return this.repository.findOne({
      where: { code } as any,
    });
  }
}

