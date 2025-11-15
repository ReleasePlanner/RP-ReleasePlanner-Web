/**
 * Calendar Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './presentation/calendar.controller';
import { CalendarService } from './application/calendar.service';
import { CalendarRepository } from './infrastructure/calendar.repository';
import { Calendar } from './domain/calendar.entity';
import { CalendarDay } from './domain/calendar-day.entity';
import { Country } from '../countries/domain/country.entity';
import { CountryModule } from '../countries/country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar, CalendarDay, Country]),
    CountryModule,
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    {
      provide: 'ICalendarRepository',
      useClass: CalendarRepository,
    },
  ],
  exports: [CalendarService, 'ICalendarRepository'],
})
export class CalendarModule {}
