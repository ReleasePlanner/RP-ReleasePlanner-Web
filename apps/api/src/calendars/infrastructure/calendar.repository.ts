import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/base/base.repository';
import { Calendar } from '../domain/calendar.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface ICalendarRepository extends IRepository<Calendar> {
  findByName(name: string): Promise<Calendar | null>;
}

@Injectable()
export class CalendarRepository
  extends BaseRepository<Calendar>
  implements ICalendarRepository
{
  async findByName(name: string): Promise<Calendar | null> {
    const calendars = await this.findAll();
    return calendars.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
  }
}

