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

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, CalendarDay])],
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
