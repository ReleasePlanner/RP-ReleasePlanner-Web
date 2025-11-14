/**
 * Plan Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { Plan } from '../domain/plan.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IPlanRepository extends IRepository<Plan> {
  findByProductId(productId: string): Promise<Plan[]>;
  findByStatus(status: string): Promise<Plan[]>;
  findByOwner(owner: string): Promise<Plan[]>;
  findByName(name: string): Promise<Plan | null>;
  findWithRelations(id: string): Promise<Plan | null>;
}

@Injectable()
export class PlanRepository
  extends BaseRepository<Plan>
  implements IPlanRepository
{
  constructor(
    @InjectRepository(Plan)
    repository: Repository<Plan>,
  ) {
    super(repository);
  }

  async findByProductId(productId: string): Promise<Plan[]> {
    return this.repository.find({
      where: { productId } as any,
    });
  }

  async findByStatus(status: string): Promise<Plan[]> {
    return this.repository.find({
      where: { status: status as any } as any,
    });
  }

  async findByOwner(owner: string): Promise<Plan[]> {
    return this.repository.find({
      where: { owner } as any,
    });
  }

  async findByName(name: string): Promise<Plan | null> {
    return this.repository.findOne({
      where: { name } as any,
    });
  }

  async findWithRelations(id: string): Promise<Plan | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: [
        'phases',
        'tasks',
        'milestones',
        'references',
        'cellData',
        'cellData.comments',
        'cellData.files',
        'cellData.links',
      ],
    });
  }

  override async findById(id: string): Promise<Plan | null> {
    return this.findWithRelations(id);
  }
}
