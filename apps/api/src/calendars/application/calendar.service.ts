import { Injectable, Inject } from '@nestjs/common';
import { Calendar } from '../domain/calendar.entity';
import { CalendarDay } from '../domain/calendar-day.entity';
import { CalendarDayType } from '../domain/calendar-day.entity';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { CalendarResponseDto } from './dto/calendar-response.dto';
import type { ICalendarRepository } from '../infrastructure/calendar.repository';
import type { ICountryRepository } from '../../countries/infrastructure/country.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString, validateArray, validateDateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class CalendarService {
  constructor(
    @Inject('ICalendarRepository')
    private readonly repository: ICalendarRepository,
    @Inject('ICountryRepository')
    private readonly countryRepository: ICountryRepository,
  ) {}

  async findAll(countryId?: string): Promise<CalendarResponseDto[]> {
    const calendars = countryId
      ? await this.repository.findByCountryId(countryId)
      : await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!calendars) {
      return [];
    }
    return calendars
      .filter((calendar) => calendar !== null && calendar !== undefined)
      .map((calendar) => new CalendarResponseDto(calendar));
  }

  async findById(id: string): Promise<CalendarResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Calendar');
    
    const calendar = await this.repository.findById(id);
    if (!calendar) {
      throw new NotFoundException('Calendar', id);
    }
    return new CalendarResponseDto(calendar);
  }

  async create(dto: CreateCalendarDto): Promise<CalendarResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreateCalendarDto');
    validateString(dto.name, 'Calendar name');

    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Calendar with name "${dto.name}" already exists`,
        'DUPLICATE_CALENDAR_NAME',
      );
    }

    // Defensive: Validate and create calendar days
    const days = dto.days
      ? dto.days.map((d) => {
          // Defensive: Validate day data
          if (!d || !d.name || !d.date || !d.type) {
            throw new Error('Invalid calendar day data');
          }
          validateString(d.name, 'Day name');
          validateDateString(d.date, 'Day date');
          return new CalendarDay(
            d.name,
            d.date,
            d.type as CalendarDayType,
            d.recurring ?? false,
            d.description,
          );
        })
      : [];

    // Get country if provided
    let country;
    if (dto.countryId) {
      const foundCountry = await this.countryRepository.findById(dto.countryId);
      if (!foundCountry) {
        throw new NotFoundException('Country', dto.countryId);
      }
      country = foundCountry;
    }

    const calendar = new Calendar(dto.name, days, dto.description, country);
    const created = await this.repository.create(calendar);
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create calendar');
    }
    
    return new CalendarResponseDto(created);
  }

  async update(id: string, dto: UpdateCalendarDto): Promise<CalendarResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Calendar');
    validateObject(dto, 'UpdateCalendarDto');

    const calendar = await this.repository.findById(id);
    if (!calendar) {
      throw new NotFoundException('Calendar', id);
    }

    if (dto.name && dto.name !== calendar.name) {
      validateString(dto.name, 'Calendar name');
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Calendar with name "${dto.name}" already exists`,
          'DUPLICATE_CALENDAR_NAME',
        );
      }
    }

    // Defensive: Validate days if provided
    if (dto.days) {
      validateArray(dto.days, 'Calendar days');
      dto.days.forEach((d) => {
        if (!d || !d.name || !d.date || !d.type) {
          throw new Error('Invalid calendar day data');
        }
      });
    }

    // Update country if provided
    if (dto.countryId !== undefined) {
      if (dto.countryId) {
        const foundCountry = await this.countryRepository.findById(dto.countryId);
        if (!foundCountry) {
          throw new NotFoundException('Country', dto.countryId);
        }
        calendar.country = foundCountry;
        calendar.countryId = foundCountry.id;
      } else {
        // countryId is null/empty, remove country
        calendar.country = undefined;
        calendar.countryId = undefined;
      }
    }

    const updated = await this.repository.update(id, dto);
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update calendar');
    }
    
    return new CalendarResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Calendar');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Calendar', id);
    }
    await this.repository.delete(id);
  }
}

