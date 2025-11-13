/**
 * Product Service
 */
import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import { ComponentVersion } from '../domain/component-version.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { IProductRepository } from '../infrastructure/product.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.repository.findAll();
    return products.map((product) => new ProductResponseDto(product));
  }

  async findById(id: string): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException('Product', id);
    }
    return new ProductResponseDto(product);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Check name uniqueness
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Product with name "${dto.name}" already exists`,
        'DUPLICATE_PRODUCT_NAME',
      );
    }

    // Create components
    const components =
      dto.components?.map(
        (c) => new ComponentVersion(c.type, c.currentVersion, c.previousVersion),
      ) || [];

    // Create product
    const product = new Product(dto.name, components);
    const created = await this.repository.create(product);
    return new ProductResponseDto(created);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException('Product', id);
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== product.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Product with name "${dto.name}" already exists`,
          'DUPLICATE_PRODUCT_NAME',
        );
      }
    }

    // Update components if provided
    if (dto.components) {
      const components = dto.components.map(
        (c) => new ComponentVersion(c.type, c.currentVersion, c.previousVersion),
      );
      product.components = components;
    }

    const updated = await this.repository.update(id, dto);
    return new ProductResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Product', id);
    }
    await this.repository.delete(id);
  }
}

