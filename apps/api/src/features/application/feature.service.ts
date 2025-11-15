import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from '../domain/feature.entity';
import { FeatureCategory } from '../../feature-categories/domain/feature-category.entity';
import { Country } from '../../countries/domain/country.entity';
import { ProductOwner } from '../domain/product-owner.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureResponseDto } from './dto/feature-response.dto';
import type { IFeatureRepository } from '../infrastructure/feature.repository';
import type { IFeatureCategoryRepository } from '../../feature-categories/infrastructure/feature-category.repository';
import type { ICountryRepository } from '../../countries/infrastructure/country.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class FeatureService {
  constructor(
    @Inject('IFeatureRepository')
    private readonly repository: IFeatureRepository,
    @Inject('IFeatureCategoryRepository')
    private readonly categoryRepository: IFeatureCategoryRepository,
    @Inject('ICountryRepository')
    private readonly countryRepository: ICountryRepository,
    @InjectRepository(ProductOwner)
    private readonly productOwnerRepository: Repository<ProductOwner>,
  ) {}

  async findAll(): Promise<FeatureResponseDto[]> {
    const features = await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!features) {
      return [];
    }
    return features
      .filter((feature) => feature !== null && feature !== undefined)
      .map((feature) => new FeatureResponseDto(feature));
  }

  async findById(id: string): Promise<FeatureResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Feature');
    
    const feature = await this.repository.findById(id);
    if (!feature) {
      throw new NotFoundException('Feature', id);
    }
    return new FeatureResponseDto(feature);
  }

  async findByProductId(productId: string): Promise<FeatureResponseDto[]> {
    // Defensive: Validate product ID
    validateId(productId, 'Product');
    
    const features = await this.repository.findByProductId(productId);
    // Defensive: Handle null/undefined results
    if (!features) {
      return [];
    }
    return features
      .filter((feature) => feature !== null && feature !== undefined)
      .map((feature) => new FeatureResponseDto(feature));
  }

  async create(dto: CreateFeatureDto): Promise<FeatureResponseDto> {
    try {
      console.log('FeatureService.create - DTO received:', JSON.stringify(dto, null, 2));
      
      // Defensive: Validate DTO
      validateObject(dto, 'CreateFeatureDto');
      validateString(dto.name, 'Feature name');
      validateString(dto.description, 'Feature description');
      validateString(dto.technicalDescription, 'Technical description');
      validateString(dto.businessDescription, 'Business description');
      validateId(dto.productId, 'Product');

      // Defensive: Validate nested objects
      if (!dto.categoryId && (!dto.category || !dto.category.name)) {
        console.error('FeatureService.create - Category validation failed:', { categoryId: dto.categoryId, category: dto.category });
        throw new Error('Category is required (either categoryId or category.name)');
      }
      if (!dto.createdBy || !dto.createdBy.name) {
        console.error('FeatureService.create - CreatedBy validation failed:', { createdBy: dto.createdBy });
        throw new Error('CreatedBy is required');
      }

      // Check name uniqueness
      const existing = await this.repository.findByName(dto.name);
      if (existing) {
        throw new ConflictException(
          `Feature with name "${dto.name}" already exists`,
          'DUPLICATE_FEATURE_NAME',
        );
      }

      // Get or create category
      let category: FeatureCategory;
      if (dto.categoryId) {
        console.log('FeatureService.create - Looking for category by ID:', dto.categoryId);
        // Use existing category by ID
        const foundCategory = await this.categoryRepository.findById(dto.categoryId);
        if (!foundCategory) {
          console.error('FeatureService.create - Category not found:', dto.categoryId);
          throw new NotFoundException('Feature Category', dto.categoryId);
        }
        category = foundCategory;
        console.log('FeatureService.create - Category found:', category.name);
      } else if (dto.category?.name) {
        console.log('FeatureService.create - Looking for category by name:', dto.category.name);
        // Fallback: find or create category by name (for backward compatibility)
        const existingCategory = await this.categoryRepository.findByName(dto.category.name);
        if (existingCategory) {
          console.log('FeatureService.create - Category found by name:', existingCategory.id);
          category = existingCategory;
        } else {
          console.log('FeatureService.create - Creating new category by name:', dto.category.name);
          const newCategory = new FeatureCategory(dto.category.name);
          category = await this.categoryRepository.create(newCategory);
          console.log('FeatureService.create - Category created and saved:', category.id);
        }
      } else {
        console.error('FeatureService.create - No category provided');
        throw new Error('Category is required');
      }
      
      // Get or create ProductOwner by name
      let productOwner: ProductOwner;
      console.log('FeatureService.create - Looking for ProductOwner by name:', dto.createdBy.name);
      const existingOwner = await this.productOwnerRepository.findOne({
        where: { name: dto.createdBy.name } as any,
      });
      
      if (existingOwner) {
        console.log('FeatureService.create - ProductOwner found:', existingOwner.id);
        productOwner = existingOwner;
      } else {
        console.log('FeatureService.create - Creating new ProductOwner:', dto.createdBy.name);
        const newOwner = new ProductOwner(dto.createdBy.name);
        productOwner = await this.productOwnerRepository.save(newOwner);
        console.log('FeatureService.create - ProductOwner created and saved:', productOwner.id);
      }

      // Get country if provided
      let country: Country | undefined;
      if (dto.countryId) {
        console.log('FeatureService.create - Looking for country by ID:', dto.countryId);
        const foundCountry = await this.countryRepository.findById(dto.countryId);
        if (!foundCountry) {
          console.error('FeatureService.create - Country not found:', dto.countryId);
          throw new NotFoundException('Country', dto.countryId);
        }
        country = foundCountry;
        console.log('FeatureService.create - Country found:', country.name);
      }

      // Create feature
      const feature = new Feature(
        dto.name,
        dto.description,
        category,
        dto.status,
        productOwner,
        dto.technicalDescription,
        dto.businessDescription,
        dto.productId,
        country,
      );

      console.log('FeatureService.create - Feature entity created, saving...');
      const created = await this.repository.create(feature);
      
      // Defensive: Validate creation result
      if (!created) {
        console.error('FeatureService.create - Failed to create feature');
        throw new Error('Failed to create feature');
      }
      
      console.log('FeatureService.create - Feature created successfully:', created.id);
      return new FeatureResponseDto(created);
    } catch (error) {
      console.error('FeatureService.create - Error:', error);
      console.error('FeatureService.create - Error message:', error instanceof Error ? error.message : String(error));
      console.error('FeatureService.create - Error stack:', error instanceof Error ? error.stack : 'No stack');
      throw error;
    }
  }

  async update(id: string, dto: UpdateFeatureDto): Promise<FeatureResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Feature');
    validateObject(dto, 'UpdateFeatureDto');

    const feature = await this.repository.findById(id);
    if (!feature) {
      throw new NotFoundException('Feature', id);
    }

    // Update nested entities if provided
    if (dto.categoryId) {
      // Use existing category by ID
      const foundCategory = await this.categoryRepository.findById(dto.categoryId);
      if (!foundCategory) {
        throw new NotFoundException('Feature Category', dto.categoryId);
      }
      feature.category = foundCategory;
    } else if (dto.category) {
      // Fallback: find or create category by name (for backward compatibility)
      // Defensive: Validate category data
      if (!dto.category.name) {
        throw new Error('Category name is required');
      }
      
      console.log('FeatureService.update - Looking for category by name:', dto.category.name);
      const existingCategory = await this.categoryRepository.findByName(dto.category.name);
      if (existingCategory) {
        console.log('FeatureService.update - Category found by name:', existingCategory.id);
        feature.category = existingCategory;
      } else {
        console.log('FeatureService.update - Creating new category by name:', dto.category.name);
        const newCategory = new FeatureCategory(dto.category.name);
        feature.category = await this.categoryRepository.create(newCategory);
        console.log('FeatureService.update - Category created and saved:', feature.category.id);
      }
    }
    if (dto.createdBy) {
      // Defensive: Validate createdBy data
      if (!dto.createdBy.name) {
        throw new Error('CreatedBy name is required');
      }
      
      // Get or create ProductOwner by name
      console.log('FeatureService.update - Looking for ProductOwner by name:', dto.createdBy.name);
      const existingOwner = await this.productOwnerRepository.findOne({
        where: { name: dto.createdBy.name } as any,
      });
      
      if (existingOwner) {
        console.log('FeatureService.update - ProductOwner found:', existingOwner.id);
        feature.createdBy = existingOwner;
      } else {
        console.log('FeatureService.update - Creating new ProductOwner:', dto.createdBy.name);
        const newOwner = new ProductOwner(dto.createdBy.name);
        feature.createdBy = await this.productOwnerRepository.save(newOwner);
        console.log('FeatureService.update - ProductOwner created and saved:', feature.createdBy.id);
      }
    }

    // Update country if provided
    if (dto.countryId !== undefined) {
      if (dto.countryId) {
        console.log('FeatureService.update - Looking for country by ID:', dto.countryId);
        const foundCountry = await this.countryRepository.findById(dto.countryId);
        if (!foundCountry) {
          throw new NotFoundException('Country', dto.countryId);
        }
        feature.country = foundCountry;
        console.log('FeatureService.update - Country found:', foundCountry.name);
      } else {
        // countryId is null/empty, remove country
        feature.country = undefined;
        feature.countryId = undefined;
      }
    }

    const updated = await this.repository.update(id, dto);
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update feature');
    }
    
    return new FeatureResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Feature');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Feature', id);
    }
    await this.repository.delete(id);
  }
}

