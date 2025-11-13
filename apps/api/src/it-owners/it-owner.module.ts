/**
 * IT Owner Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITOwnerController } from './presentation/it-owner.controller';
import { ITOwnerService } from './application/it-owner.service';
import { ITOwnerRepository } from './infrastructure/it-owner.repository';
import { ITOwner } from './domain/it-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ITOwner])],
  controllers: [ITOwnerController],
  providers: [
    ITOwnerService,
    {
      provide: 'IITOwnerRepository',
      useClass: ITOwnerRepository,
    },
  ],
  exports: [ITOwnerService, 'IITOwnerRepository'],
})
export class ITOwnerModule {}
