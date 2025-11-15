import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD, Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasePhaseModule } from '../base-phases/base-phase.module';
import { ProductModule } from '../products/product.module';
import { FeatureModule } from '../features/feature.module';
import { CalendarModule } from '../calendars/calendar.module';
import { ITOwnerModule } from '../it-owners/it-owner.module';
import { ComponentTypeModule } from '../component-types/component-type.module';
import { FeatureCategoryModule } from '../feature-categories/feature-category.module';
import { CountryModule } from '../countries/country.module';
import { PlanModule } from '../release-plans/plan.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '../common/interceptors/timeout.interceptor';
import { RequestContextInterceptor } from '../common/interceptors/request-context.interceptor';
import { SecurityMiddleware } from '../common/middleware/security.middleware';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CacheModule } from '../common/cache/cache.module';
import { PrometheusMetricsModule } from '../common/metrics/prometheus.module';
import databaseConfig from '../config/database.config';
import redisConfig from '../config/redis.config';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig],
    }),
    CacheModule,
    PrometheusMetricsModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: parseInt(process.env.RATE_LIMIT_SHORT || '100', 10), // 100 requests per minute
      },
      {
        name: 'medium',
        ttl: 600000, // 10 minutes
        limit: parseInt(process.env.RATE_LIMIT_MEDIUM || '200', 10), // 200 requests per 10 minutes
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: parseInt(process.env.RATE_LIMIT_LONG || '1000', 10), // 1000 requests per hour
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    TerminusModule,
    AuthModule,
    UsersModule,
    BasePhaseModule,
    ProductModule,
    FeatureModule,
    CalendarModule,
    ITOwnerModule,
    ComponentTypeModule,
    FeatureCategoryModule,
    CountryModule,
    PlanModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    Reflector,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => {
        const timeoutMs = parseInt(
          process.env.REQUEST_TIMEOUT_MS || '30000',
          10,
        );
        return new TimeoutInterceptor(timeoutMs);
      },
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
