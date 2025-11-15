/**
 * Component Type Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentTypeController } from './presentation/component-type.controller';
import { ComponentTypeService } from './application/component-type.service';
import { ComponentTypeRepository } from './infrastructure/component-type.repository';
import { ComponentType } from './domain/component-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentType])],
  controllers: [ComponentTypeController],
  providers: [
    ComponentTypeService,
    {
      provide: 'IComponentTypeRepository',
      useClass: ComponentTypeRepository,
    },
  ],
  exports: [ComponentTypeService, 'IComponentTypeRepository'],
})
export class ComponentTypeModule {}

