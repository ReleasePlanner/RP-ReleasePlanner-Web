import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasePhaseModule } from '../base-phases/base-phase.module';
import { ProductModule } from '../products/product.module';
import { FeatureModule } from '../features/feature.module';
import { CalendarModule } from '../calendars/calendar.module';
import { ITOwnerModule } from '../it-owners/it-owner.module';
import { PlanModule } from '../release-plans/plan.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Module({
  imports: [
    BasePhaseModule,
    ProductModule,
    FeatureModule,
    CalendarModule,
    ITOwnerModule,
    PlanModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
