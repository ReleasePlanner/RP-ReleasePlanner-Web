import { Injectable, Inject } from '@nestjs/common';
import { Calendar } from '../domain/calendar.entity';
import { CalendarDay } from '../domain/calendar-day.entity';
import { CalendarDayType } from '../domain/calendar-day.entity';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { CalendarResponseDto } from './dto/calendar-response.dto';
import { ICalendarRepository } from '../infrastructure/calendar.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

@Injectable()
export class CalendarService {
  constructor(
    @Inject('ICalendarRepository')
    private readonly repository: ICalendarRepository,
  ) {}

  async findAll(): Promise<CalendarResponseDto[]> {
    const calendars = await this.repository.findAll();
    return calendars.map((calendar) => new CalendarResponseDto(calendar));
  }

  async findById(id: string): Promise<CalendarResponseDto> {
    const calendar = await this.repository.findById(id);
    if (!calendar) {
      throw new NotFoundException('Calendar', id);
    }
    return new CalendarResponseDto(calendar);
  }

  async create(dto: CreateCalendarDto): Promise<CalendarResponseDto> {
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Calendar with name "${dto.name}" already exists`,
        'DUPLICATE_CALENDAR_NAME',
      );
    }

    const days =
      dto.days?.map(
        (d) =>
          new CalendarDay(
            d.name,
            d.date,
            d.type as CalendarDayType,
            d.recurring,
            d.description,
          ),
      ) || [];

    const calendar = new Calendar(dto.name, days, dto.description);
    const created = await this.repository.create(calendar);
    return new CalendarResponseDto(created);
  }

  async update(id: string, dto: UpdateCalendarDto): Promise<CalendarResponseDto> {
    const calendar = await this.repository.findById(id);
    if (!calendar) {
      throw new NotFoundException('Calendar', id);
    }

    if (dto.name && dto.name !== calendar.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Calendar with name "${dto.name}" already exists`,
          'DUPLICATE_CALENDAR_NAME',
        );
      }
    }

    const updated = await this.repository.update(id, dto);
    return new CalendarResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Calendar', id);
    }
    await this.repository.delete(id);
  }
}

