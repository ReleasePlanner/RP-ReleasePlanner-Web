/**
 * Feature Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureController } from './presentation/feature.controller';
import { FeatureService } from './application/feature.service';
import { FeatureRepository } from './infrastructure/feature.repository';
import { Feature } from './domain/feature.entity';
import { FeatureCategory } from './domain/feature-category.entity';
import { ProductOwner } from './domain/product-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feature, FeatureCategory, ProductOwner])],
  controllers: [FeatureController],
  providers: [
    FeatureService,
    {
      provide: 'IFeatureRepository',
      useClass: FeatureRepository,
    },
  ],
  exports: [FeatureService, 'IFeatureRepository'],
})
export class FeatureModule {}
