/**
 * Feature Category Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureCategoryController } from './presentation/feature-category.controller';
import { FeatureCategoryService } from './application/feature-category.service';
import { FeatureCategoryRepository } from './infrastructure/feature-category.repository';
import { FeatureCategory } from './domain/feature-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureCategory]),
  ],
  controllers: [FeatureCategoryController],
  providers: [
    FeatureCategoryService,
    {
      provide: 'IFeatureCategoryRepository',
      useClass: FeatureCategoryRepository,
    },
  ],
  exports: [FeatureCategoryService, 'IFeatureCategoryRepository'],
})
export class FeatureCategoryModule {}

