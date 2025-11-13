import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/base/base.repository';
import { Plan } from '../domain/plan.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IPlanRepository extends IRepository<Plan> {
  findByName(name: string): Promise<Plan | null>;
  findByOwner(owner: string): Promise<Plan[]>;
  findByStatus(status: string): Promise<Plan[]>;
}

@Injectable()
export class PlanRepository extends BaseRepository<Plan> implements IPlanRepository {
  async findByName(name: string): Promise<Plan | null> {
    const plans = await this.findAll();
    return plans.find((p) => p.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async findByOwner(owner: string): Promise<Plan[]> {
    return this.findMany({ owner } as Partial<Plan>);
  }

  async findByStatus(status: string): Promise<Plan[]> {
    return this.findMany({ status: status as Plan['status'] } as Partial<Plan>);
  }
}

