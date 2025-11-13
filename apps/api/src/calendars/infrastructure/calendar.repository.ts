/**
 * Calendar Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Calendar } from '../domain/calendar.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface ICalendarRepository extends IRepository<Calendar> {
  findByName(name: string): Promise<Calendar | null>;
  findWithDays(id: string): Promise<Calendar | null>;
}

@Injectable()
export class CalendarRepository
  extends BaseRepository<Calendar>
  implements ICalendarRepository
{
  constructor(
    @InjectRepository(Calendar)
    repository: Repository<Calendar>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Calendar | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }

  async findWithDays(id: string): Promise<Calendar | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: ['days'],
    });
  }

  override async findById(id: string): Promise<Calendar | null> {
    return this.findWithDays(id);
  }
}
