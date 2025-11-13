import { Module } from '@nestjs/common';
import { ITOwnerController } from './presentation/it-owner.controller';
import { ITOwnerService } from './application/it-owner.service';
import { ITOwnerRepository } from './infrastructure/it-owner.repository';

@Module({
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

