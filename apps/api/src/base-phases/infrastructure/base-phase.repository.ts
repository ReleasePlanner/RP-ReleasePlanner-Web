/**
 * Base Phase Repository
 * 
 * Infrastructure layer - Data access using TypeORM
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/database/base.repository';
import { BasePhase } from '../domain/base-phase.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { validateString } from '@rp-release-planner/rp-shared';

export interface IBasePhaseRepository extends IRepository<BasePhase> {
  findByName(name: string): Promise<BasePhase | null>;
  findByColor(color: string): Promise<BasePhase | null>;
}

@Injectable()
export class BasePhaseRepository
  extends BaseRepository<BasePhase>
  implements IBasePhaseRepository
{
  constructor(
    @InjectRepository(BasePhase)
    repository: Repository<BasePhase>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<BasePhase | null> {
    // Defensive: Validate name before query
    validateString(name, 'Phase name');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { name: name.toLowerCase() } as any,
      }),
      `findByName(${name})`,
    );
  }

  async findByColor(color: string): Promise<BasePhase | null> {
    // Defensive: Validate color before query
    validateString(color, 'Phase color');
    
    return this.handleDatabaseOperation(
      () => this.repository.findOne({
        where: { color: color.toLowerCase() } as any,
      }),
      `findByColor(${color})`,
    );
  }
}
