/**
 * Base Phase Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasePhaseController } from './presentation/base-phase.controller';
import { BasePhaseService } from './application/base-phase.service';
import { BasePhaseRepository } from './infrastructure/base-phase.repository';
import { BasePhase } from './domain/base-phase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasePhase])],
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

