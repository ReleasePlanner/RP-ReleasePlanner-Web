import { Module } from '@nestjs/common';
import { FeatureController } from './presentation/feature.controller';
import { FeatureService } from './application/feature.service';
import { FeatureRepository } from './infrastructure/feature.repository';

@Module({
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

