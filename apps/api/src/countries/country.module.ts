/**
 * Country Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './presentation/country.controller';
import { CountryService } from './application/country.service';
import { CountryRepository } from './infrastructure/country.repository';
import { Country } from './domain/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
  ],
  controllers: [CountryController],
  providers: [
    CountryService,
    {
      provide: 'ICountryRepository',
      useClass: CountryRepository,
    },
  ],
  exports: [CountryService, 'ICountryRepository'],
})
export class CountryModule {}

