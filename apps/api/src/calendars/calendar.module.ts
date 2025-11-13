import { Module } from '@nestjs/common';
import { CalendarController } from './presentation/calendar.controller';
import { CalendarService } from './application/calendar.service';
import { CalendarRepository } from './infrastructure/calendar.repository';

@Module({
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

