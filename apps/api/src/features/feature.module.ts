/**
 * Feature Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureController } from './presentation/feature.controller';
import { FeatureService } from './application/feature.service';
import { FeatureRepository } from './infrastructure/feature.repository';
import { Feature } from './domain/feature.entity';
import { FeatureCategory } from '../feature-categories/domain/feature-category.entity';
import { Country } from '../countries/domain/country.entity';
import { ProductOwner } from './domain/product-owner.entity';
import { FeatureCategoryModule } from '../feature-categories/feature-category.module';
import { CountryModule } from '../countries/country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feature, FeatureCategory, Country, ProductOwner]),
    FeatureCategoryModule,
    CountryModule,
  ],
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
