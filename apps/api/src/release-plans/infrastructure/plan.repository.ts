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
import { validateId } from '@rp-release-planner/rp-shared';
import { NotFoundException } from '../../common/exceptions/business-exception';

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
    // Normalize name: trim whitespace and normalize multiple spaces
    const normalizedName = name.trim().replace(/\s+/g, ' ');
    if (!normalizedName) {
      return null;
    }
    
    console.log(`[PlanRepository.findByName] Searching for:`, {
      original: name,
      normalized: normalizedName,
      normalizedLower: normalizedName.toLowerCase(),
    });
    
    // Fetch all plans and compare normalized names
    // This ensures we catch duplicates regardless of:
    // - Case differences (MB vs mb)
    // - Multiple spaces (MB  Independent vs MB Independent)
    // - Leading/trailing spaces
    const allPlans = await this.repository.find();
    
    console.log(`[PlanRepository.findByName] Total plans in DB:`, allPlans.length);
    
    const found = allPlans.find(plan => {
      const planNameNormalized = plan.name.trim().replace(/\s+/g, ' ');
      const matches = planNameNormalized.toLowerCase() === normalizedName.toLowerCase();
      
      // Log only if match found
      if (matches) {
        console.log(`[PlanRepository.findByName] Match found:`, {
          planId: plan.id,
          planName: plan.name,
          planNameNormalized: planNameNormalized,
          planNameLower: planNameNormalized.toLowerCase(),
          searchedNormalized: normalizedName,
          searchedLower: normalizedName.toLowerCase(),
        });
      }
      
      return matches;
    });
    
    if (found) {
      console.log(`[PlanRepository.findByName] DUPLICATE FOUND:`, {
        searched: normalizedName,
        foundId: found.id,
        foundName: found.name,
        foundNormalized: found.name.trim().replace(/\s+/g, ' ').toLowerCase(),
      });
    } else {
      console.log(`[PlanRepository.findByName] No duplicate found for:`, normalizedName);
    }
    
    return found || null;
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

  override async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Plan');
    
    return this.handleDatabaseOperation(
      async () => {
        // Use transaction to ensure all related data is deleted atomically
        await this.repository.manager.transaction(async (transactionalEntityManager) => {
          // First, load the plan with all relations to ensure cascade works correctly
          const plan = await transactionalEntityManager.findOne(Plan, {
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
          
          if (!plan) {
            throw new NotFoundException('Plan', id);
          }
          
          // Delete the plan - TypeORM cascade will handle all related entities
          // Due to cascade: true and onDelete: 'CASCADE', all related data will be deleted
          await transactionalEntityManager.remove(Plan, plan);
        });
      },
      `delete(${id})`,
    );
  }
}
