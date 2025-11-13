/**
 * Base Phase Repository
 * 
 * Infrastructure layer - Data access
 */
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/base/base.repository';
import { BasePhase } from '../domain/base-phase.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

export interface IBasePhaseRepository extends IRepository<BasePhase> {
  findByName(name: string): Promise<BasePhase | null>;
  findByColor(color: string): Promise<BasePhase | null>;
}

@Injectable()
export class BasePhaseRepository
  extends BaseRepository<BasePhase>
  implements IBasePhaseRepository
{
  async findByName(name: string): Promise<BasePhase | null> {
    const phases = await this.findAll();
    return phases.find((p) => p.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async findByColor(color: string): Promise<BasePhase | null> {
    const phases = await this.findAll();
    return phases.find((p) => p.color.toLowerCase() === color.toLowerCase()) || null;
  }
}

