import { Injectable, Inject } from '@nestjs/common';
import { Country } from '../domain/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryResponseDto } from './dto/country-response.dto';
import type { ICountryRepository } from '../infrastructure/country.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class CountryService {
  constructor(
    @Inject('ICountryRepository')
    private readonly repository: ICountryRepository,
  ) {}

  async findAll(): Promise<CountryResponseDto[]> {
    const countries = await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!countries) {
      return [];
    }
    return countries
      .filter((country) => country !== null && country !== undefined)
      .map((country) => new CountryResponseDto(country));
  }

  async findById(id: string): Promise<CountryResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Country');
    
    const country = await this.repository.findById(id);
    if (!country) {
      throw new NotFoundException('Country', id);
    }
    return new CountryResponseDto(country);
  }

  async create(dto: CreateCountryDto): Promise<CountryResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreateCountryDto');
    validateString(dto.name, 'Country name');
    validateString(dto.code, 'Country code');

    const existingByName = await this.repository.findByName(dto.name);
    if (existingByName) {
      throw new ConflictException(
        `Country with name "${dto.name}" already exists`,
        'DUPLICATE_COUNTRY_NAME',
      );
    }

    const existingByCode = await this.repository.findByCode(dto.code);
    if (existingByCode) {
      throw new ConflictException(
        `Country with code "${dto.code}" already exists`,
        'DUPLICATE_COUNTRY_CODE',
      );
    }

    const country = new Country(dto.name, dto.code, dto.isoCode, dto.region);
    const created = await this.repository.create(country);
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create Country');
    }
    
    return new CountryResponseDto(created);
  }

  async update(id: string, dto: UpdateCountryDto): Promise<CountryResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Country');
    validateObject(dto, 'UpdateCountryDto');

    const country = await this.repository.findById(id);
    if (!country) {
      throw new NotFoundException('Country', id);
    }

    if (dto.name && dto.name !== country.name) {
      validateString(dto.name, 'Country name');
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Country with name "${dto.name}" already exists`,
          'DUPLICATE_COUNTRY_NAME',
        );
      }
    }

    if (dto.code && dto.code !== country.code) {
      validateString(dto.code, 'Country code');
      const existing = await this.repository.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Country with code "${dto.code}" already exists`,
          'DUPLICATE_COUNTRY_CODE',
        );
      }
    }

    const updated = await this.repository.update(id, dto);
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update Country');
    }
    
    return new CountryResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Country');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Country', id);
    }
    await this.repository.delete(id);
  }
}

