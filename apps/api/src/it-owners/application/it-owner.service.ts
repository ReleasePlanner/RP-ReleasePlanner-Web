import { Injectable, Inject } from '@nestjs/common';
import { ITOwner } from '../domain/it-owner.entity';
import { CreateITOwnerDto } from './dto/create-it-owner.dto';
import { UpdateITOwnerDto } from './dto/update-it-owner.dto';
import { ITOwnerResponseDto } from './dto/it-owner-response.dto';
import type { IITOwnerRepository } from '../infrastructure/it-owner.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class ITOwnerService {
  constructor(
    @Inject('IITOwnerRepository')
    private readonly repository: IITOwnerRepository,
  ) {}

  async findAll(): Promise<ITOwnerResponseDto[]> {
    const owners = await this.repository.findAll();
    // Defensive: Handle null/undefined results
    if (!owners) {
      return [];
    }
    return owners
      .filter((owner) => owner !== null && owner !== undefined)
      .map((owner) => new ITOwnerResponseDto(owner));
  }

  async findById(id: string): Promise<ITOwnerResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'IT Owner');
    
    const owner = await this.repository.findById(id);
    if (!owner) {
      throw new NotFoundException('IT Owner', id);
    }
    return new ITOwnerResponseDto(owner);
  }

  async create(dto: CreateITOwnerDto): Promise<ITOwnerResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreateITOwnerDto');
    validateString(dto.name, 'IT Owner name');

    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `IT Owner with name "${dto.name}" already exists`,
        'DUPLICATE_IT_OWNER_NAME',
      );
    }

    const owner = new ITOwner(dto.name);
    const created = await this.repository.create(owner);
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create IT Owner');
    }
    
    return new ITOwnerResponseDto(created);
  }

  async update(id: string, dto: UpdateITOwnerDto): Promise<ITOwnerResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'IT Owner');
    validateObject(dto, 'UpdateITOwnerDto');

    const owner = await this.repository.findById(id);
    if (!owner) {
      throw new NotFoundException('IT Owner', id);
    }

    if (dto.name && dto.name !== owner.name) {
      validateString(dto.name, 'IT Owner name');
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `IT Owner with name "${dto.name}" already exists`,
          'DUPLICATE_IT_OWNER_NAME',
        );
      }
    }

    const updated = await this.repository.update(id, dto);
    
    // Defensive: Validate update result
    if (!updated) {
      throw new Error('Failed to update IT Owner');
    }
    
    return new ITOwnerResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'IT Owner');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('IT Owner', id);
    }
    await this.repository.delete(id);
  }
}

