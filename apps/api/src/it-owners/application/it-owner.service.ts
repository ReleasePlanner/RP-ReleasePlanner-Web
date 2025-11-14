import { Injectable, Inject } from '@nestjs/common';
import { ITOwner } from '../domain/it-owner.entity';
import { CreateITOwnerDto } from './dto/create-it-owner.dto';
import { UpdateITOwnerDto } from './dto/update-it-owner.dto';
import { ITOwnerResponseDto } from './dto/it-owner-response.dto';
import type { IITOwnerRepository } from '../infrastructure/it-owner.repository';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';

@Injectable()
export class ITOwnerService {
  constructor(
    @Inject('IITOwnerRepository')
    private readonly repository: IITOwnerRepository,
  ) {}

  async findAll(): Promise<ITOwnerResponseDto[]> {
    const owners = await this.repository.findAll();
    return owners.map((owner) => new ITOwnerResponseDto(owner));
  }

  async findById(id: string): Promise<ITOwnerResponseDto> {
    const owner = await this.repository.findById(id);
    if (!owner) {
      throw new NotFoundException('IT Owner', id);
    }
    return new ITOwnerResponseDto(owner);
  }

  async create(dto: CreateITOwnerDto): Promise<ITOwnerResponseDto> {
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(
        `IT Owner with name "${dto.name}" already exists`,
        'DUPLICATE_IT_OWNER_NAME',
      );
    }

    const owner = new ITOwner(dto.name);
    const created = await this.repository.create(owner);
    return new ITOwnerResponseDto(created);
  }

  async update(id: string, dto: UpdateITOwnerDto): Promise<ITOwnerResponseDto> {
    const owner = await this.repository.findById(id);
    if (!owner) {
      throw new NotFoundException('IT Owner', id);
    }

    if (dto.name && dto.name !== owner.name) {
      const existing = await this.repository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `IT Owner with name "${dto.name}" already exists`,
          'DUPLICATE_IT_OWNER_NAME',
        );
      }
    }

    const updated = await this.repository.update(id, dto);
    return new ITOwnerResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('IT Owner', id);
    }
    await this.repository.delete(id);
  }
}

