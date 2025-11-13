/**
 * Base Phase Module
 */
import { Module } from '@nestjs/common';
import { BasePhaseController } from './presentation/base-phase.controller';
import { BasePhaseService } from './application/base-phase.service';
import { BasePhaseRepository } from './infrastructure/base-phase.repository';

@Module({
  controllers: [BasePhaseController],
  providers: [
    BasePhaseService,
    {
      provide: 'IBasePhaseRepository',
      useClass: BasePhaseRepository,
    },
  ],
  exports: [BasePhaseService, 'IBasePhaseRepository'],
})
export class BasePhaseModule {}

