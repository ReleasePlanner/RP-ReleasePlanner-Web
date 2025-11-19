/**
 * Product Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Product } from '../domain/product.entity';
import { ProductComponentVersion } from '../domain/component-version.entity';
import { ProductComponent } from '../../component-types/domain/component-type.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { NotFoundException } from '../../common/exceptions/business-exception';
import { validateString, validateId } from '@rp-release-planner/rp-shared';

export interface IProductRepository extends IRepository<Product> {
  findByName(name: string): Promise<Product | null>;
  findWithComponents(id: string): Promise<Product | null>;
}

@Injectable()
export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
    @InjectRepository(ProductComponent)
    private readonly componentTypeRepository: Repository<ProductComponent>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Product | null> {
    // Defensive: Validate name before query
    validateString(name, 'Product name');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { name } as any,
      }),
      `findByName(${name})`,
    );
  }

  async findWithComponents(id: string): Promise<Product | null> {
    // Defensive: Validate ID before query
    validateId(id, 'Product');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { id } as any,
        relations: ['components', 'components.componentType'],
      }),
      `findWithComponents(${id})`,
    );
  }

  override async findById(id: string): Promise<Product | null> {
    return this.findWithComponents(id);
  }

  override async findAll(): Promise<Product[]> {
    return this.handleDatabaseOperation(
      () => this.repository.find({
        relations: ['components', 'components.componentType'],
      }),
      'findAll',
    );
  }

  override async update(id: string, updates: Partial<Product>): Promise<Product> {
    // Defensive: Validate inputs
    validateId(id, 'Product');
    if (updates === null || updates === undefined) {
      throw new Error('Updates cannot be null or undefined');
    }
    
    return this.handleDatabaseOperation(
      async () => {
        // Load product with components and componentType relations
        const entity = await this.repository.findOne({
          where: { id } as any,
          relations: ['components', 'components.componentType'],
        });
        
        if (!entity) {
          throw new NotFoundException('Product', String(id));
        }

        // Update basic fields (name, etc.)
        if (updates.name !== undefined) {
          entity.name = updates.name;
        }

        // Handle components separately if provided
        if (updates.components !== undefined) {
          const ProductComponentVersion = require('../domain/component-version.entity').ProductComponentVersion;
          
          // Check if this is a partial update from external transaction (e.g., plan update)
          // In this case, we should NOT delete components that are not in the updates array
          const isPartialUpdate = (updates as any)._partialUpdate === true;
          
          console.log('ProductRepository.update - updates.components:', JSON.stringify(updates.components, null, 2));
          console.log('ProductRepository.update - isPartialUpdate:', isPartialUpdate);
          console.log('ProductRepository.update - entity.components before:', JSON.stringify(entity.components?.map((c: any) => ({ id: c.id, componentTypeId: c.componentTypeId, currentVersion: c.currentVersion, previousVersion: c.previousVersion, productId: (c as any).productId })), null, 2));
          
          // Ensure entity.components is initialized
          if (!entity.components) {
            entity.components = [];
          }
          
          // Ensure all existing components have productId set (defensive)
          for (const existingComp of entity.components) {
            if (!(existingComp as any).productId) {
              (existingComp as any).productId = id;
            }
          }
          
          const existingComponentIds = new Set(
            entity.components.map((c: any) => c.id).filter(Boolean)
          );
          
          console.log('ProductRepository.update - existingComponentIds:', Array.from(existingComponentIds));
          
          // Update or create components
          const components: any[] = [];
          for (const c of updates.components) {
            console.log('ProductRepository.update - processing component:', JSON.stringify(c, null, 2));
            // Validate component data
            if (!c) {
              throw new Error(`Component is null or undefined`);
            }
            // Validate that componentTypeId is provided
            if (!c.componentTypeId) {
              throw new Error(`Component type is missing: 'componentTypeId' must be provided`);
            }
            // Validate currentVersion
            if (!c.currentVersion || (typeof c.currentVersion === 'string' && c.currentVersion.trim() === '')) {
              throw new Error(`Component currentVersion is missing or empty: ${JSON.stringify(c)}`);
            }
            // Validate previousVersion - allow empty string but not null/undefined
            if (c.previousVersion === null || c.previousVersion === undefined) {
              throw new Error(`Component previousVersion is null or undefined: ${JSON.stringify(c)}`);
            }
            // If previousVersion is empty string, use currentVersion as fallback
            const previousVersion = (c.previousVersion && c.previousVersion.trim() !== '') 
              ? c.previousVersion 
              : c.currentVersion;
            
            // Handle componentTypeId (required)
            let componentType: ProductComponent | undefined;
            try {
              componentType = await this.componentTypeRepository.findOne({
                where: { id: c.componentTypeId } as any,
              });
              if (!componentType) {
                console.error(`ProductRepository.update - Component Type with id "${c.componentTypeId}" not found`);
                throw new Error(`Component Type with id "${c.componentTypeId}" not found`);
              }
              console.log(`ProductRepository.update - Found ProductComponent by ID: ${componentType.id}, code: ${componentType.code}, name: ${componentType.name}`);
            } catch (error) {
              console.error(`ProductRepository.update - Error finding ProductComponent by ID "${c.componentTypeId}":`, error);
              throw error;
            }
            
            // If component has an id and exists in the entity, update it
            if (c.id && existingComponentIds.has(c.id)) {
              const existingComponent = entity.components.find((comp: any) => comp.id === c.id);
              if (existingComponent) {
                // Update existing component properties
                // Ensure productId is set (defensive)
                if (!existingComponent.productId) {
                  (existingComponent as any).productId = id;
                }
                // Update name if provided
                if (c.name !== undefined) {
                  existingComponent.name = c.name;
                }
                // Update componentType if it's different to avoid unnecessary updates
                if (!existingComponent.componentTypeId || existingComponent.componentTypeId !== componentType.id) {
                  // For ManyToOne relations, TypeORM prefers updating the foreign key directly
                  // Clear the relation object first to avoid conflicts with eager loading
                  delete (existingComponent as any).componentType;
                  // Update the foreign key - TypeORM will handle the relation on save
                  existingComponent.componentTypeId = componentType.id;
                }
                existingComponent.currentVersion = c.currentVersion;
                existingComponent.previousVersion = previousVersion;
                components.push(existingComponent);
                continue;
              }
            }
            
            // Otherwise, create a new component
            // Note: If c.id exists but component doesn't exist in entity, we ignore the id
            // and create a new component (the id might be invalid or from another product)
            if (!componentType) {
              throw new Error('Component type is required (componentTypeId must be provided)');
            }
            const newComponent = new ProductComponentVersion(componentType, c.currentVersion, previousVersion, c.name);
            (newComponent as any).productId = id;
            // Explicitly set the product relation to ensure TypeORM cascade works correctly
            (newComponent as any).product = entity;
            components.push(newComponent);
          }
          
          // Ensure all components have productId set before assigning
          // This is critical for TypeORM to properly handle the relation
          for (const comp of components) {
            if (!comp.productId) {
              (comp as any).productId = id;
            }
            // Ensure product relation is set for all components
            if (!(comp as any).product) {
              (comp as any).product = entity;
            }
            // Ensure componentTypeId is set
            if (!comp.componentTypeId) {
              throw new Error('Component componentTypeId is missing');
            }
          }
          
          // Find components that need to be removed (orphans)
          // IMPORTANT: Only remove components if this is NOT a partial update from external transaction
          // When updating from plan, we should preserve all existing components and only update versions
          if (!isPartialUpdate) {
            const componentsToKeepIds = new Set(
              components.map((c: any) => c.id).filter(Boolean)
            );
            const componentsToRemove = entity.components.filter(
              (existingComp: any) => existingComp.id && !componentsToKeepIds.has(existingComp.id)
            );
            
            // Remove orphaned components explicitly before assigning new array
            // This prevents TypeORM from trying to process them incorrectly
            if (componentsToRemove.length > 0) {
              console.log('ProductRepository.update - removing orphaned components:', componentsToRemove.map((c: any) => c.id));
              const ProductComponentVersionRepository = this.repository.manager.getRepository(ProductComponentVersion);
              await ProductComponentVersionRepository.remove(componentsToRemove);
            }
          } else {
            console.log('ProductRepository.update - Partial update detected: preserving all existing components, only updating versions');
            // For partial updates, ensure all existing components are included in the components array
            // Components not in the updates array should be preserved with their existing versions
            const updateComponentIds = new Set(
              components.map((c: any) => c.id).filter(Boolean)
            );
            const existingComponentsNotInUpdate = entity.components.filter(
              (existingComp: any) => existingComp.id && !updateComponentIds.has(existingComp.id)
            );
            
            // Add existing components that are not in the update to preserve them
            // These components should be added as entity objects (not plain objects) so TypeORM can track them
            for (const existingComp of existingComponentsNotInUpdate) {
              // Use the existing entity object directly - TypeORM will preserve it
              components.push(existingComp);
            }
            console.log('ProductRepository.update - Preserved existing components:', existingComponentsNotInUpdate.map((c: any) => c.id));
          }
          
          // Assign the new components array
          // TypeORM will handle updates and new components via cascade: true
          entity.components = components;
          console.log('ProductRepository.update - components after processing:', JSON.stringify(components.map((c: any) => ({ id: c.id, componentTypeId: c.componentTypeId, currentVersion: c.currentVersion, previousVersion: c.previousVersion, productId: (c as any).productId })), null, 2));
        }

        console.log('ProductRepository.update - about to save entity');
        try {
          const saved = await this.repository.save(entity);
          console.log('ProductRepository.update - entity saved successfully');
          if (!saved) {
            throw new Error('Failed to save updated product');
          }
          
          // Reload with relations to ensure we return the complete entity
          const reloaded = await this.repository.findOne({
            where: { id } as any,
            relations: ['components', 'components.componentType'],
          });
          
          return reloaded || saved;
        } catch (saveError) {
          console.error('ProductRepository.update - Error saving entity:', saveError);
          console.error('ProductRepository.update - Entity state:', JSON.stringify({
            id: entity.id,
            name: entity.name,
            componentsCount: entity.components?.length || 0,
            components: entity.components?.map((c: any) => ({
              id: c.id,
              type: c.type,
              currentVersion: c.currentVersion,
              previousVersion: c.previousVersion,
              productId: (c as any).productId,
            })) || [],
          }, null, 2));
          throw saveError;
        }
      },
      `update(${id})`,
    );
  }
}
