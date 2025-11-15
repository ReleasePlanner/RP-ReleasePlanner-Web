/**
 * Product Module
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './presentation/product.controller';
import { ProductService } from './application/product.service';
import { ProductRepository } from './infrastructure/product.repository';
import { Product } from './domain/product.entity';
import { ComponentVersion } from './domain/component-version.entity';
import { ComponentType } from '../component-types/domain/component-type.entity';
import { ComponentTypeModule } from '../component-types/component-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ComponentVersion, ComponentType]),
    ComponentTypeModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService, 'IProductRepository'],
})
export class ProductModule {}

