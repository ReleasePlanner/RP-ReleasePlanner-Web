/**
 * Plan Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './presentation/plan.controller';
import { PlanService } from './application/plan.service';
import { PlanRepository } from './infrastructure/plan.repository';
import { Plan } from './domain/plan.entity';
import { PlanPhase } from './domain/plan-phase.entity';
import { PlanTask } from './domain/plan-task.entity';
import { PlanMilestone } from './domain/plan-milestone.entity';
import { PlanReference } from './domain/plan-reference.entity';
import { GanttCellData, GanttCellComment, GanttCellFile, GanttCellLink } from './domain/gantt-cell-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      PlanPhase,
      PlanTask,
      PlanMilestone,
      PlanReference,
      GanttCellData,
      GanttCellComment,
      GanttCellFile,
      GanttCellLink,
    ]),
  ],
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
