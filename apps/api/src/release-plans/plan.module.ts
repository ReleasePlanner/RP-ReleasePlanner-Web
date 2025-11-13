import { Module } from '@nestjs/common';
import { PlanController } from './presentation/plan.controller';
import { PlanService } from './application/plan.service';
import { PlanRepository } from './infrastructure/plan.repository';

@Module({
  controllers: [PlanController],
  providers: [
    PlanService,
    {
      provide: 'IPlanRepository',
      useClass: PlanRepository,
    },
  ],
  exports: [PlanService, 'IPlanRepository'],
})
export class PlanModule {}

