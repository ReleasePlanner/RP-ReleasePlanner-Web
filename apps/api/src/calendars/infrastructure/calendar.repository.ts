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
import { CalendarDay } from '../domain/calendar-day.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { UpdateCalendarDto } from '../application/dto/update-calendar.dto';
import { NotFoundException } from '../../common/exceptions/business-exception';

export interface ICalendarRepository extends IRepository<Calendar> {
  findByName(name: string): Promise<Calendar | null>;
  findWithDays(id: string): Promise<Calendar | null>;
  findByCountryId(countryId: string): Promise<Calendar[]>;
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
      relations: ['country'],
    });
  }

  async findWithDays(id: string): Promise<Calendar | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: ['days', 'country'],
    });
  }

  override async findAll(): Promise<Calendar[]> {
    return this.repository.find({
      relations: ['days', 'country'],
    });
  }

  override async findById(id: string): Promise<Calendar | null> {
    return this.findWithDays(id);
  }

  async findByCountryId(countryId: string): Promise<Calendar[]> {
    return this.repository.find({
      where: { countryId } as any,
      relations: ['days', 'country'],
    });
  }

  override async update(id: string, updates: Partial<Calendar> | UpdateCalendarDto): Promise<Calendar> {
    return this.handleDatabaseOperation(
      async () => {
        // Load calendar with days relation
        const entity = await this.repository.findOne({
          where: { id } as any,
          relations: ['days', 'country'],
        });
        
        if (!entity) {
          throw new NotFoundException('Calendar', id);
        }

        // Handle days update separately to ensure calendarId is set
        const dto = updates as UpdateCalendarDto;
        if (dto.days !== undefined) {
          // Get existing day IDs to identify which are being updated vs deleted
          const existingDayIds = (entity.days || []).map((d: any) => d.id).filter(Boolean);
          const incomingDayIds = dto.days.map((d: any) => d.id).filter(Boolean);
          
          // Delete days that are no longer in the incoming array
          const daysToDelete = existingDayIds.filter((id: string) => !incomingDayIds.includes(id));
          if (daysToDelete.length > 0) {
            await this.repository.manager.delete(CalendarDay, daysToDelete);
          }
          
          // Create or update CalendarDay entities with calendarId
          const newDays = dto.days.map((dayData) => {
            // Check if this is an existing day (has id and exists in entity.days)
            const hasId = dayData.id && typeof dayData.id === 'string' && dayData.id.trim() !== '';
            const existingDay = hasId ? entity.days?.find((d: any) => d.id === dayData.id) : null;
            
            if (existingDay) {
              // Update existing day
              existingDay.name = dayData.name;
              existingDay.date = dayData.date;
              existingDay.type = dayData.type as any;
              existingDay.recurring = dayData.recurring ?? false;
              existingDay.description = dayData.description;
              // Ensure calendarId is set
              (existingDay as any).calendarId = id;
              return existingDay;
            } else {
              // Create new day (no id or id doesn't match existing)
              const day = new CalendarDay(
                dayData.name,
                dayData.date,
                dayData.type as any,
                dayData.recurring ?? false,
                dayData.description,
              );
              // Explicitly set calendarId - this is critical for new days
              (day as any).calendarId = id;
              return day;
            }
          });
          
          // Assign new/updated days to entity
          entity.days = newDays;
        }

        // Update other fields
        if (dto.name !== undefined) {
          entity.name = dto.name;
        }
        if (dto.description !== undefined) {
          entity.description = dto.description;
        }

        // Save entity (cascade will handle days)
        const saved = await this.repository.save(entity);
        if (!saved) {
          throw new Error('Failed to save updated calendar');
        }
        
        // Reload with relations to return complete entity
        const reloaded = await this.findWithDays(id);
        return reloaded || saved;
      },
      `update(${id})`,
    );
  }
}
