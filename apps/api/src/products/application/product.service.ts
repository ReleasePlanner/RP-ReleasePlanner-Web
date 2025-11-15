/**
 * Product Service
 */
import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import { ComponentVersion } from '../domain/component-version.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import type { IProductRepository } from '../infrastructure/product.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString, validateArray } from '@rp-release-planner/rp-shared';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!products) {
      return [];
    }
    return products.map((product) => {
      if (!product) return null;
      return new ProductResponseDto(product);
    }).filter(Boolean) as ProductResponseDto[];
  }

  async findById(id: string): Promise<ProductResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Product');
    
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException('Product', id);
    }
    return new ProductResponseDto(product);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreateProductDto');
    validateString(dto.name, 'Product name');

    // Check name uniqueness
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `Product with name "${dto.name}" already exists`,
        'DUPLICATE_PRODUCT_NAME',
      );
    }

    // Create components
    const components = dto.components
      ? dto.components.map((c) => {
          // Defensive: Validate component data
          if (!c || !c.type || !c.currentVersion || !c.previousVersion) {
            throw new Error('Invalid component data');
          }
          return new ComponentVersion(c.type, c.currentVersion, c.previousVersion);
        })
      : [];

    // Create product
    const product = new Product(dto.name, components);
    const created = await this.repository.create(product);
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create product');
    }
    
    return new ProductResponseDto(created);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Product');
    validateObject(dto, 'UpdateProductDto');

    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException('Product', id);
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== product.name) {
      validateString(dto.name, 'Product name');
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Product with name "${dto.name}" already exists`,
          'DUPLICATE_PRODUCT_NAME',
        );
      }
    }

    // Prepare updates object
    const updates: Partial<Product> = {};
    
    // Update name if provided
    if (dto.name !== undefined) {
      updates.name = dto.name;
    }

    // Update components if provided
    if (dto.components) {
      validateArray(dto.components, 'Components');
      console.log('ProductService.update - components received:', JSON.stringify(dto.components, null, 2));
      // Pass plain objects with id preserved - repository will handle entity conversion
      updates.components = dto.components.map((c) => {
        // Defensive: Validate component data
        if (!c || !c.type || !c.currentVersion) {
          console.error('ProductService.update - Invalid component:', JSON.stringify(c));
          throw new Error(`Invalid component data: ${JSON.stringify(c)}`);
        }
        // If previousVersion is empty, use currentVersion as fallback
        const previousVersion = (c.previousVersion && c.previousVersion.trim() !== '') 
          ? c.previousVersion 
          : c.currentVersion;
        // Return plain object with id if present, so repository can match existing components
        const componentData = {
          id: c.id, // Preserve id if present
          name: c.name, // Include name if present
          type: c.type,
          currentVersion: c.currentVersion,
          previousVersion: previousVersion,
          productId: id,
        };
        console.log('ProductService.update - mapped component:', JSON.stringify(componentData, null, 2));
        return componentData;
      }) as any;
      console.log('ProductService.update - final components array:', JSON.stringify(updates.components, null, 2));
    }

    const updated = await this.repository.update(id, updates);
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update product');
    }
    
    return new ProductResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Product');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Product', id);
    }
    await this.repository.delete(id);
  }
}

