import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { Plan, PlanStatus } from '../domain/plan.entity';
import { PlanPhase } from '../domain/plan-phase.entity';
import { PlanTask } from '../domain/plan-task.entity';
import { PlanMilestone } from '../domain/plan-milestone.entity';
import { PlanReference, PlanReferenceType } from '../domain/plan-reference.entity';
import { GanttCellData } from '../domain/gantt-cell-data.entity';
import { GanttCellComment } from '../domain/gantt-cell-data.entity';
import { GanttCellFile } from '../domain/gantt-cell-data.entity';
import { GanttCellLink } from '../domain/gantt-cell-data.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import type { IPlanRepository } from '../infrastructure/plan.repository';
import type { IFeatureRepository } from '../../features/infrastructure/feature.repository';
import { Feature, FeatureStatus } from '../../features/domain/feature.entity';
import { ComponentVersion } from '../../products/domain/component-version.entity';
import { Product } from '../../products/domain/product.entity';
import { PlanComponentVersion } from '../domain/plan-component-version.entity';
import { ConflictException, NotFoundException } from '../../common/exceptions/business-exception';
import { validateId, validateObject, validateString, validateArray, validateDateString } from '@rp-release-planner/rp-shared';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);

  constructor(
    @Inject('IPlanRepository')
    private readonly repository: IPlanRepository,
    @Inject('IFeatureRepository')
    private readonly featureRepository: IFeatureRepository,
  ) {}

  async findAll(): Promise<PlanResponseDto[]> {
    // Use findAllWithOwnerName to get owner name from it_owners table via JOIN
    const plans = await (this.repository as any).findAllWithOwnerName();
    // Defensive: Handle null/undefined results
    if (!plans) {
      return [];
    }
    return plans
      .filter((plan) => plan !== null && plan !== undefined)
      .map((plan) => new PlanResponseDto(plan));
  }

  async findById(id: string): Promise<PlanResponseDto> {
    // Defensive: Validate ID before query
    validateId(id, 'Plan');
    
    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException('Plan', id);
    }
    return new PlanResponseDto(plan);
  }

  async create(dto: CreatePlanDto): Promise<PlanResponseDto> {
    // Defensive: Validate DTO
    validateObject(dto, 'CreatePlanDto');
    validateString(dto.name, 'Plan name');
    validateString(dto.owner, 'Plan owner');
    validateDateString(dto.startDate, 'Start date');
    validateDateString(dto.endDate, 'End date');
    
    // Validate required fields
    if (!dto.status) {
      throw new Error('Status is required');
    }
    if (!dto.productId) {
      throw new Error('Product ID is required');
    }

    // Defensive: Validate date logic
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }

    // Normalize plan name: trim and normalize multiple spaces
    const normalizedName = dto.name.trim().replace(/\s+/g, ' ');
    
    console.log(`[PlanService.create] Checking name uniqueness:`, {
      original: dto.name,
      normalized: normalizedName,
      normalizedLower: normalizedName.toLowerCase(),
    });

    // Check name uniqueness (case-insensitive and space-normalized)
    const existing = await this.repository.findByName(normalizedName);
    if (existing) {
      console.log(`[PlanService.create] Duplicate found:`, {
        searched: normalizedName,
        searchedLower: normalizedName.toLowerCase(),
        existingId: existing.id,
        existingName: existing.name,
        existingNormalized: existing.name.trim().replace(/\s+/g, ' '),
        existingLower: existing.name.trim().replace(/\s+/g, ' ').toLowerCase(),
      });
      throw new ConflictException(
        `Ya existe un plan con el nombre "${existing.name}". Por favor, usa un nombre diferente.`,
        'DUPLICATE_PLAN_NAME',
      );
    }

    // Create plan with normalized name (owner field removed - use itOwner instead)
    const plan = new Plan(
      normalizedName,
      dto.startDate,
      dto.endDate,
      dto.status,
      dto.description,
    );

    if (dto.description) {
      plan.description = dto.description;
    }
    validateId(dto.productId, 'Product');
    plan.productId = dto.productId;
    if (dto.itOwner) {
      validateId(dto.itOwner, 'IT Owner');
      plan.itOwner = dto.itOwner;
    }
    if (dto.featureIds) {
      validateArray(dto.featureIds, 'Feature IDs');
      dto.featureIds.forEach((fid) => validateId(fid, 'Feature'));
      plan.featureIds = dto.featureIds;
    }
    if (dto.calendarIds) {
      validateArray(dto.calendarIds, 'Calendar IDs');
      dto.calendarIds.forEach((cid) => validateId(cid, 'Calendar'));
      plan.calendarIds = dto.calendarIds;
    }

    // Add phases if provided
    if (dto.phases) {
      validateArray(dto.phases, 'Phases');
      dto.phases.forEach((p) => {
        // Defensive: Validate phase data
        if (!p || !p.name) {
          throw new Error('Phase name is required');
        }
        validateString(p.name, 'Phase name');
        if (p.startDate) validateDateString(p.startDate, 'Phase start date');
        if (p.endDate) validateDateString(p.endDate, 'Phase end date');
        const phase = new PlanPhase(p.name, p.startDate, p.endDate, p.color);
        plan.addPhase(phase);
      });
    }

    const created = await this.repository.create(plan);
    
    console.log(`[PlanService.create] Plan created successfully:`, {
      id: created?.id,
      name: created?.name,
      normalizedName: created?.name?.trim().replace(/\s+/g, ' ').toLowerCase(),
    });
    
    // Defensive: Validate creation result
    if (!created) {
      throw new Error('Failed to create plan');
    }
    
    const response = new PlanResponseDto(created);
    console.log(`[PlanService.create] Returning PlanResponseDto:`, {
      id: response.id,
      name: response.name,
    });
    
    return response;
  }

  async update(id: string, dto: UpdatePlanDto): Promise<PlanResponseDto> {
    // Defensive: Validate inputs
    validateId(id, 'Plan');
    validateObject(dto, 'UpdatePlanDto');

    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundException('Plan', id);
    }

    // Optimistic locking: Check if plan was modified since client last fetched it
    if (dto.updatedAt) {
      const clientUpdatedAt = new Date(dto.updatedAt);
      const serverUpdatedAt = new Date(plan.updatedAt);
      
      // Allow small time difference for clock skew (1 second tolerance)
      const timeDiff = Math.abs(serverUpdatedAt.getTime() - clientUpdatedAt.getTime());
      if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
        throw new ConflictException(
          'Plan was modified by another user. Please refresh and try again.',
          'CONCURRENT_MODIFICATION',
        );
      }
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== plan.name) {
      validateString(dto.name, 'Plan name');
      
      // Normalize plan name: trim and normalize multiple spaces
      const normalizedName = dto.name.trim().replace(/\s+/g, ' ');
      
      // Only check uniqueness if normalized name is different from current plan's normalized name
      const currentNormalizedName = plan.name.trim().replace(/\s+/g, ' ');
      if (normalizedName.toLowerCase() !== currentNormalizedName.toLowerCase()) {
        const existing = await this.repository.findByName(normalizedName);
        if (existing && existing.id !== id) {
          throw new ConflictException(
            `Plan with name "${normalizedName}" already exists`,
            'DUPLICATE_PLAN_NAME',
          );
        }
        // Update with normalized name
        plan.name = normalizedName;
      }
    }

    // Defensive: Validate date logic if dates are being updated
    if (dto.startDate !== undefined && dto.endDate !== undefined) {
      validateDateString(dto.startDate, 'Start date');
      validateDateString(dto.endDate, 'End date');
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);
      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }
    } else if (dto.startDate !== undefined) {
      validateDateString(dto.startDate, 'Start date');
      const startDate = new Date(dto.startDate);
      const endDate = new Date(plan.endDate);
      if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
      }
    } else if (dto.endDate !== undefined) {
      validateDateString(dto.endDate, 'End date');
      const startDate = new Date(plan.startDate);
      const endDate = new Date(dto.endDate);
      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }
    }

    // Update basic fields
    if (dto.name !== undefined) {
      validateString(dto.name, 'Plan name');
      plan.name = dto.name;
    }
    if (dto.owner !== undefined) {
      validateString(dto.owner, 'Plan owner');
      plan.owner = dto.owner;
    }
    if (dto.startDate !== undefined) {
      plan.startDate = dto.startDate;
    }
    if (dto.endDate !== undefined) {
      plan.endDate = dto.endDate;
    }
    if (dto.status !== undefined) {
      plan.status = dto.status;
    }
    if (dto.description !== undefined) {
      plan.description = dto.description;
    }
    if (dto.productId !== undefined) {
      validateId(dto.productId, 'Product');
      plan.productId = dto.productId;
    }
    if (dto.itOwner !== undefined) {
      validateId(dto.itOwner, 'IT Owner');
      plan.itOwner = dto.itOwner;
    }
    if (dto.featureIds !== undefined) {
      validateArray(dto.featureIds, 'Feature IDs');
      dto.featureIds.forEach((fid) => validateId(fid, 'Feature'));
      plan.featureIds = dto.featureIds;
    }
    if (dto.calendarIds !== undefined) {
      validateArray(dto.calendarIds, 'Calendar IDs');
      dto.calendarIds.forEach((cid) => validateId(cid, 'Calendar'));
      plan.calendarIds = dto.calendarIds;
    }
    if (dto.components !== undefined) {
      validateArray(dto.components, 'Components');
      this.logger.log(`[PlanService.update] Validating ${dto.components.length} components`);
      this.logger.debug(`[PlanService.update] Components data: ${JSON.stringify(dto.components, null, 2)}`);
      dto.components.forEach((comp, index) => {
        this.logger.debug(`[PlanService.update] Validating component ${index}:`, {
          comp,
          hasComponentId: !!comp?.componentId,
          hasCurrentVersion: !!comp?.currentVersion,
          hasFinalVersion: !!comp?.finalVersion,
          componentId: comp?.componentId,
          currentVersion: comp?.currentVersion,
          finalVersion: comp?.finalVersion,
        });
        if (!comp || !comp.componentId || !comp.currentVersion || !comp.finalVersion) {
          this.logger.error(`[PlanService.update] Invalid component at index ${index}:`, {
            comp,
            componentId: comp?.componentId,
            currentVersion: comp?.currentVersion,
            finalVersion: comp?.finalVersion,
          });
          throw new BadRequestException(`Invalid component data at index ${index}: componentId=${comp?.componentId || 'undefined'}, currentVersion=${comp?.currentVersion || 'undefined'}, finalVersion=${comp?.finalVersion || 'undefined'}`);
        }
        validateId(comp.componentId, 'Component');
        validateString(comp.currentVersion, 'Current version');
        validateString(comp.finalVersion, 'Final version');
        
        // Validate that finalVersion is greater than currentVersion
        // Load product to get component currentVersion
        if (plan.productId) {
          const planRepo = this.repository as any;
          if (planRepo.repository && planRepo.repository.manager) {
            // Use a synchronous check if possible, or validate after loading product
            // For now, we'll validate in the transaction when creating version history
            // But we can add a quick validation here if product is already loaded
          }
        }
      });
      
      // Store previous components for version history comparison
      const previousComponents = plan.components || [];
      const previousComponentsMap = new Map(
        previousComponents.map((c) => [c.componentId, c.finalVersion])
      );
      
      // Update plan components - ensure we're assigning the full array with all required fields
      this.logger.debug(`[PlanService.update] Assigning components to plan:`, {
        planId: plan.id,
        previousComponentsCount: previousComponents.length,
        newComponentsCount: dto.components.length,
        newComponents: dto.components.map((c) => ({
          componentId: c.componentId,
          currentVersion: c.currentVersion,
          finalVersion: c.finalVersion,
        })),
      });
      
      // Explicitly assign the components array - TypeORM should detect this change
      plan.components = dto.components.map((c) => ({
        componentId: c.componentId,
        currentVersion: c.currentVersion,
        finalVersion: c.finalVersion,
      }));
      
      this.logger.debug(`[PlanService.update] Plan components after assignment:`, {
        planId: plan.id,
        componentsCount: plan.components?.length || 0,
        components: plan.components?.map((c: any) => ({
          componentId: c.componentId,
          currentVersion: c.currentVersion,
          finalVersion: c.finalVersion,
        })) || [],
      });
      
      // Create version history records for new or changed components
      // Access EntityManager through repository for transactional operations
      // Note: Version history is supplementary - if it fails, plan update should still succeed
      const planRepo = this.repository as any;
      if (planRepo.repository && planRepo.repository.manager && plan.productId && dto.components && dto.components.length > 0) {
        // Use transaction to ensure atomicity - await to ensure it completes before saving plan
        // But don't fail the entire update if version history fails
        try {
          await planRepo.repository.manager.transaction(async (transactionalEntityManager) => {
            // Load product to get component currentVersions
            const product = await transactionalEntityManager.findOne(Product, {
              where: { id: plan.productId } as any,
              relations: ['components'],
            });
            
            if (product && product.components) {
              const componentMap = new Map(
                product.components.map((c) => [c.id, c.currentVersion || ''])
              );
              
              /**
               * Normalizes version to full format for comparison: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
               */
              const normalizeVersion = (version: string): string => {
                if (!version || version.trim().length === 0) return "0.0.0.0";
                const parts = version.trim().split(".").map((p) => parseInt(p, 10) || 0);
                while (parts.length < 4) {
                  parts.push(0);
                }
                return parts.slice(0, 4).join(".");
              };

              /**
               * Compares two semantic versions
               * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
               */
              const compareVersions = (v1: string, v2: string): number => {
                const normalized1 = normalizeVersion(v1);
                const normalized2 = normalizeVersion(v2);
                const parts1 = normalized1.split(".").map((p) => parseInt(p, 10));
                const parts2 = normalized2.split(".").map((p) => parseInt(p, 10));

                for (let i = 0; i < 4; i++) {
                  if (parts1[i] < parts2[i]) return -1;
                  if (parts1[i] > parts2[i]) return 1;
                }
                return 0;
              };
              
              for (const newComp of dto.components) {
                try {
                  const component = product.components.find((c) => c.id === newComp.componentId);
                  if (!component) {
                    console.warn(`Component ${newComp.componentId} not found in product ${plan.productId}`);
                    continue;
                  }

                  const currentVersion = component.currentVersion || '';
                  const previousVersion = previousComponentsMap.get(newComp.componentId);
                  
                  // Validate that finalVersion is greater than product's currentVersion
                  // BUT: If component was already in plan, allow if finalVersion > previousVersion
                  // (this handles the case where product was already updated from a previous save)
                  const comparison = compareVersions(newComp.finalVersion, currentVersion);
                  const isUpdate = previousVersion && compareVersions(newComp.finalVersion, previousVersion) > 0;
                  
                  // Allow if:
                  // 1. finalVersion > currentVersion (normal case - new component or product not updated yet)
                  // 2. OR component was already in plan and finalVersion > previousVersion (updating existing component)
                  if (comparison <= 0 && !isUpdate) {
                    // More detailed error message
                    const componentName = component.name || newComp.componentId;
                    const errorMsg = previousVersion
                      ? `La versión final del componente "${componentName}" (${newComp.finalVersion}) debe ser mayor que la versión actual del producto (${currentVersion}). Versión anterior en el plan: ${previousVersion}`
                      : `La versión final del componente "${componentName}" (${newComp.finalVersion}) debe ser mayor que la versión actual del producto (${currentVersion})`;
                    console.error(`Component version validation failed:`, {
                      componentId: newComp.componentId,
                      componentName,
                      finalVersion: newComp.finalVersion,
                      currentVersion,
                      previousVersion,
                      comparison,
                      isUpdate,
                    });
                    // Use BadRequestException to ensure proper HTTP error response
                    throw new BadRequestException(errorMsg);
                  }
                  
                  // Only create history record if:
                  // 1. Component is new (not in previous list), OR
                  // 2. Component version changed
                  if (!previousVersion || previousVersion !== newComp.finalVersion) {
                    // Get oldVersion:
                    // - If component was already in plan, use previous finalVersion
                    // - If component is new, use currentVersion from product
                    const oldVersion = previousVersion || currentVersion || '';
                    
                    // Defensive: Ensure oldVersion is not empty (validation requires it)
                    // If oldVersion is empty, use finalVersion as fallback (for new components)
                    const finalOldVersion = oldVersion && oldVersion.trim().length > 0 ? oldVersion.trim() : (newComp.finalVersion || '0.0.0.0');
                    
                    // Ensure newVersion is not empty
                    const finalNewVersion = newComp.finalVersion && newComp.finalVersion.trim().length > 0 ? newComp.finalVersion.trim() : '0.0.0.0';
                    
                    if (!finalOldVersion || finalOldVersion.trim().length === 0 || !finalNewVersion || finalNewVersion.trim().length === 0) {
                      console.warn(`Skipping version history for component ${newComp.componentId}: invalid versions`, {
                        oldVersion: finalOldVersion,
                        newVersion: finalNewVersion,
                      });
                      continue;
                    }
                    
                    // Validate all required fields before creating entity
                    if (!plan.id || !plan.productId || !newComp.componentId) {
                      console.error(`[PlanService.update] Missing required fields for version history:`, {
                        planId: plan.id,
                        productId: plan.productId,
                        componentId: newComp.componentId,
                      });
                      throw new Error(`Missing required fields for component version history: planId=${plan.id}, productId=${plan.productId}, componentId=${newComp.componentId}`);
                    }
                    
                    try {
                      console.log(`[PlanService.update] Creating PlanComponentVersion:`, {
                        planId: plan.id,
                        productId: plan.productId,
                        componentId: newComp.componentId,
                        oldVersion: finalOldVersion,
                        newVersion: finalNewVersion,
                      });
                      
                      const versionHistory = new PlanComponentVersion(
                        plan.id,
                        plan.productId,
                        newComp.componentId,
                        finalOldVersion,
                        finalNewVersion
                      );
                      
                      console.log(`[PlanService.update] Saving version history:`, {
                        planId: plan.id,
                        productId: plan.productId,
                        componentId: newComp.componentId,
                        oldVersion: finalOldVersion,
                        newVersion: newComp.finalVersion,
                      });
                      
                      await transactionalEntityManager.save(PlanComponentVersion, versionHistory);
                    } catch (versionHistoryError) {
                      console.error(`[PlanService.update] Error saving version history:`, {
                        error: versionHistoryError,
                        planId: plan.id,
                        productId: plan.productId,
                        componentId: newComp.componentId,
                        oldVersion: finalOldVersion,
                        newVersion: newComp.finalVersion,
                      });
                      throw versionHistoryError; // Re-throw to fail transaction
                    }
                  }
                } catch (componentError) {
                  // If it's a validation error (BadRequestException or Error with 'debe ser mayor'), throw it to fail the entire transaction
                  if (
                    componentError instanceof BadRequestException ||
                    (componentError instanceof Error && componentError.message.includes('debe ser mayor'))
                  ) {
                    throw componentError;
                  }
                  // Log other errors for this component but continue with others
                  console.error(`Error saving version history for component ${newComp.componentId}:`, componentError);
                  // Don't throw - continue with other components
                }
              }
            } else {
              console.warn(`Product ${plan.productId} not found or has no components - skipping version history`);
            }
          });
        } catch (error) {
          // If it's a validation error (BadRequestException or Error with 'debe ser mayor'), fail the entire update
          if (
            error instanceof BadRequestException ||
            (error instanceof Error && error.message.includes('debe ser mayor'))
          ) {
            console.error('Component version validation failed:', error);
            throw error; // Throw to fail the entire plan update
          }
          // Log other errors but don't fail the update - version history is supplementary
          console.error('Error saving component version history (non-fatal):', error);
          // Don't throw - allow plan update to proceed even if version history fails
        }
      }
    }

    // Update phases if provided (replace all phases)
    if (dto.phases !== undefined) {
      validateArray(dto.phases, 'Phases');
      // Clear existing phases array (TypeORM will handle deletion via cascade)
      plan.phases = [];
      // Create new phases with explicit planId
      dto.phases.forEach((p) => {
        // Defensive: Validate phase data
        if (!p || !p.name) {
          throw new Error('Phase name is required');
        }
        validateString(p.name, 'Phase name');
        if (p.startDate) validateDateString(p.startDate, 'Phase start date');
        if (p.endDate) validateDateString(p.endDate, 'Phase end date');
        const phase = new PlanPhase(p.name, p.startDate, p.endDate, p.color);
        // Explicitly set planId before adding to ensure it's not null
        // This is critical to prevent null constraint violations
        phase.planId = plan.id;
        plan.addPhase(phase);
      });
    }

    // Update tasks if provided (replace all tasks)
    if (dto.tasks !== undefined) {
      validateArray(dto.tasks, 'Tasks');
      plan.tasks = [];
      dto.tasks.forEach((t) => {
        // Defensive: Validate task data
        if (!t || !t.title || !t.startDate || !t.endDate) {
          throw new Error('Task title, start date, and end date are required');
        }
        validateString(t.title, 'Task title');
        validateDateString(t.startDate, 'Task start date');
        validateDateString(t.endDate, 'Task end date');
        const taskStart = new Date(t.startDate);
        const taskEnd = new Date(t.endDate);
        if (taskStart >= taskEnd) {
          throw new Error('Task end date must be after start date');
        }
        const task = new PlanTask(t.title, t.startDate, t.endDate, t.color);
        plan.addTask(task);
      });
    }

    // Update references if provided (replace all references)
    // IMPORTANT: Also sync milestones from milestone-type references
    // Process references FIRST to collect milestone references before processing explicit milestones
    let milestoneReferencesFromRefs: Array<{ date: string; name: string; description?: string; phaseId?: string }> = [];
    
    if (dto.references !== undefined) {
      validateArray(dto.references, 'References');
      
      // IMPORTANT: TypeORM requires explicit deletion of existing references before replacing
      // Simply setting plan.references = [] doesn't delete from database
      if (plan.references && plan.references.length > 0) {
        // Remove existing references from database
        const planRepo = this.repository as any;
        if (planRepo.repository && planRepo.repository.manager) {
          await planRepo.repository.manager.remove(PlanReference, plan.references);
        } else {
          // Fallback: use repository's manager directly if available
          const repo = (this.repository as any).repository;
          if (repo && repo.manager) {
            await repo.manager.remove(PlanReference, plan.references);
          }
        }
      }
      
      // Now create new references array
      plan.references = [];
      
      // Collect milestone references to sync with plan.milestones
      // Use a Set to track unique milestone keys to prevent duplicates
      const milestoneReferences: Array<{ date: string; name: string; description?: string; phaseId?: string }> = [];
      const milestoneKeys = new Set<string>();
      
      dto.references.forEach((r) => {
        // Defensive: Validate reference data
        if (!r || !r.type || !r.title) {
          throw new Error('Reference type and title are required');
        }
        validateString(r.type, 'Reference type');
        validateString(r.title, 'Reference title');
        if (r.date) validateDateString(r.date, 'Reference date');
        
        // Validate phaseId if provided (must be a valid UUID, not a temporary ID like "phase-..." or empty string)
        let validPhaseId: string | undefined = undefined;
        if (r.phaseId && typeof r.phaseId === 'string' && r.phaseId.trim() !== '') {
          const trimmedPhaseId = r.phaseId.trim();
          // Filter out temporary IDs that start with "phase-"
          if (trimmedPhaseId.startsWith('phase-')) {
            console.warn(`[PlanService.update] Skipping temporary phaseId: ${trimmedPhaseId}`);
            validPhaseId = undefined;
          } else {
            validateId(trimmedPhaseId, 'Phase');
            validPhaseId = trimmedPhaseId;
          }
        }
        
        // If this is a milestone reference with date, collect it for milestone sync
        // Deduplicate based on phaseId-date key to prevent duplicate milestones
        if (r.type === 'milestone' && r.date) {
          const milestoneKey = `${validPhaseId || ''}-${r.date}`;
          if (!milestoneKeys.has(milestoneKey)) {
            milestoneKeys.add(milestoneKey);
            milestoneReferences.push({
              date: r.date,
              name: r.title,
              description: r.description,
              phaseId: validPhaseId, // Use validated phaseId
            });
          } else {
            this.logger.warn(`[PlanService.update] Skipping duplicate milestone reference: ${milestoneKey}`);
          }
        }
        
        const reference = new PlanReference(
          r.type as PlanReferenceType,
          r.title,
          r.url,
          r.description,
          r.date,
          validPhaseId, // Use validated phaseId (can be undefined for NULL in DB)
          (r as any).milestoneColor, // Include milestoneColor for milestone type references
        );
        reference.planId = plan.id;
        
        // Explicitly set phaseId to ensure it's saved (even if undefined, TypeORM will save as NULL)
        // This is important because the constructor only sets phaseId if it's not undefined
        // But we want to ensure it's explicitly set (or null) for proper database storage
        if (validPhaseId === undefined) {
          // Explicitly set to null to ensure database stores NULL instead of potentially skipping the field
          (reference as any).phaseId = null;
        }
        
        // Log for debugging
        if (r.type === 'milestone' && r.date) {
          this.logger.log(`[PlanService.update] Creating milestone reference:`, {
            title: r.title,
            date: r.date,
            phaseId: validPhaseId || null,
            originalPhaseId: r.phaseId,
            milestoneColor: (r as any).milestoneColor,
            referencePhaseId: reference.phaseId,
          });
        }
        if (!plan.references) plan.references = [];
        plan.references.push(reference);
      });
      
      // Sync milestones from milestone-type references
      // IMPORTANT: When saving references tab, milestones from milestone-type references
      // should always be synced to plan_milestones table
      if (milestoneReferences.length > 0) {
        // IMPORTANT: TypeORM requires explicit deletion of existing milestones before replacing
        // Simply setting plan.milestones = [] doesn't delete from database
        if (plan.milestones && plan.milestones.length > 0) {
          // Save existing milestones to a temporary array before clearing
          const existingMilestones = [...plan.milestones];
          
          // Clear plan.milestones FIRST to prevent TypeORM from trying to save them
          plan.milestones = [];
          
          // Remove existing milestones from database
          const planRepo = this.repository as any;
          if (planRepo.repository && planRepo.repository.manager) {
            await planRepo.repository.manager.remove(PlanMilestone, existingMilestones);
          } else {
            // Fallback: use repository's manager directly if available
            const repo = (this.repository as any).repository;
            if (repo && repo.manager) {
              await repo.manager.remove(PlanMilestone, existingMilestones);
            }
          }
        } else {
          // Ensure milestones array is initialized
          plan.milestones = [];
        }
        
        // When milestone references are present, use them as the ONLY source of truth
        // The frontend may also send dto.milestones extracted from references, but we should
        // IGNORE them to avoid duplicates. Milestones are created ONLY from milestone references.
        milestoneReferences.forEach((m) => {
          const milestone = new PlanMilestone(m.date, m.name, m.description, m.phaseId);
          milestone.planId = plan.id;
          plan.milestones.push(milestone);
        });
        
        // IMPORTANT: When milestone references are present, ignore dto.milestones completely
        // to prevent duplicates. The milestones are already created from references above.
      }
    }

    // Update milestones explicitly if provided (separate from references)
    // This handles the case where dto.milestones is provided but dto.references is not or doesn't contain milestone references
    // Only process if references were not provided OR references were provided but didn't contain milestone references
    const hasMilestoneReferences = dto.references !== undefined && 
      dto.references.some((r) => r.type === 'milestone' && r.date);
    
    if (dto.milestones !== undefined && !hasMilestoneReferences) {
      validateArray(dto.milestones, 'Milestones');
      
      // IMPORTANT: TypeORM requires explicit deletion of existing milestones before replacing
      // Simply setting plan.milestones = [] doesn't delete from database
      if (plan.milestones && plan.milestones.length > 0) {
        // Save existing milestones to a temporary array before clearing
        const existingMilestones = [...plan.milestones];
        
        // Clear plan.milestones FIRST to prevent TypeORM from trying to save them
        plan.milestones = [];
        
        // Remove existing milestones from database
        const planRepo = this.repository as any;
        if (planRepo.repository && planRepo.repository.manager) {
          await planRepo.repository.manager.remove(PlanMilestone, existingMilestones);
        } else {
          // Fallback: use repository's manager directly if available
          const repo = (this.repository as any).repository;
          if (repo && repo.manager) {
            await repo.manager.remove(PlanMilestone, existingMilestones);
          }
        }
      } else {
        // Ensure milestones array is initialized
        plan.milestones = [];
      }
      
      // Create new milestones array
      dto.milestones.forEach((m) => {
        // Defensive: Validate milestone data
        if (!m || !m.date || !m.name) {
          throw new Error('Milestone date and name are required');
        }
        validateDateString(m.date, 'Milestone date');
        validateString(m.name, 'Milestone name');
        if (m.phaseId) validateId(m.phaseId, 'Phase');
        
        const milestone = new PlanMilestone(m.date, m.name, m.description, m.phaseId);
        milestone.planId = plan.id;
        plan.milestones.push(milestone);
      });
    }

    // Update cellData if provided (replace all cellData)
    if (dto.cellData !== undefined) {
      validateArray(dto.cellData, 'Cell data');
      plan.cellData = [];
      dto.cellData.forEach((c) => {
        // Defensive: Validate cell data
        if (!c || !c.date) {
          throw new Error('Cell data date is required');
        }
        validateDateString(c.date, 'Cell date');
        if (c.phaseId) validateId(c.phaseId, 'Phase');
        
        const cellData = new GanttCellData(
          c.date,
          c.phaseId,
          c.isMilestone,
          c.milestoneColor,
        );
        cellData.planId = plan.id;

        // Add comments if provided
        if (c.comments) {
          validateArray(c.comments, 'Comments');
          cellData.comments = [];
          c.comments.forEach((cm) => {
            // Defensive: Validate comment data
            if (!cm || !cm.text || !cm.author) {
              throw new Error('Comment text and author are required');
            }
            validateString(cm.text, 'Comment text');
            validateString(cm.author, 'Comment author');
            const comment = new GanttCellComment(cm.text, cm.author);
            comment.cellDataId = cellData.id;
            if (!cellData.comments) cellData.comments = [];
            cellData.comments.push(comment);
          });
        }

        // Add files if provided
        if (c.files) {
          validateArray(c.files, 'Files');
          cellData.files = [];
          c.files.forEach((f) => {
            // Defensive: Validate file data
            if (!f || !f.name || !f.url) {
              throw new Error('File name and URL are required');
            }
            validateString(f.name, 'File name');
            validateString(f.url, 'File URL');
            if (f.size !== undefined && (typeof f.size !== 'number' || f.size < 0)) {
              throw new Error('File size must be a non-negative number');
            }
            const file = new GanttCellFile(f.name, f.url, f.size, f.mimeType);
            file.cellDataId = cellData.id;
            if (!cellData.files) cellData.files = [];
            cellData.files.push(file);
          });
        }

        // Add links if provided
        if (c.links) {
          validateArray(c.links, 'Links');
          cellData.links = [];
          c.links.forEach((l) => {
            // Defensive: Validate link data
            if (!l || !l.title || !l.url) {
              throw new Error('Link title and URL are required');
            }
            validateString(l.title, 'Link title');
            validateString(l.url, 'Link URL');
            const link = new GanttCellLink(l.title, l.url, l.description);
            link.cellDataId = cellData.id;
            if (!cellData.links) cellData.links = [];
            cellData.links.push(link);
          });
        }

        if (!plan.cellData) plan.cellData = [];
        plan.cellData.push(cellData);
      });
    }

    // Validate plan before saving
    try {
      plan.validate();
      console.log('[PlanService.update] Plan validation passed');
    } catch (validationError) {
      console.error('[PlanService.update] Plan validation failed:', validationError);
      throw new Error(`Plan validation failed: ${validationError instanceof Error ? validationError.message : String(validationError)}`);
    }

    try {
      this.logger.log('[PlanService.update] About to save plan:', {
        id: plan.id,
        name: plan.name,
        componentsCount: plan.components?.length || 0,
        components: plan.components?.map((c: any) => ({
          componentId: c.componentId,
          currentVersion: c.currentVersion,
          finalVersion: c.finalVersion,
        })) || [],
      });
      
      // Save plan - TypeORM should automatically serialize the JSONB field
      // For JSONB columns, TypeORM should detect changes automatically, but we'll ensure it's saved
      const updated = await this.repository.save(plan);
      
      // Defensive: Validate update result
      if (!updated) {
        throw new Error('Failed to update plan');
      }
      
      // Reload plan to verify components were saved correctly (TypeORM might cache the entity)
      const reloadedPlan = await this.repository.findById(updated.id);
      
      // Verify components were saved correctly
      this.logger.log('[PlanService.update] Plan saved successfully:', {
        id: updated.id,
        name: updated.name,
        componentsCountBeforeReload: updated.components?.length || 0,
        componentsAfterReload: reloadedPlan?.components?.length || 0,
        components: reloadedPlan?.components?.map((c: any) => ({
          componentId: c.componentId,
          currentVersion: c.currentVersion,
          finalVersion: c.finalVersion,
        })) || [],
      });
      
      // Use reloaded plan to ensure we have the latest data from database
      return new PlanResponseDto(reloadedPlan || updated);
    } catch (saveError: any) {
      console.error('[PlanService.update] Error saving plan:', {
        error: saveError,
        errorMessage: saveError?.message,
        errorStack: saveError?.stack,
        errorName: saveError?.name,
        errorCode: saveError?.code,
      });
      console.error('[PlanService.update] Plan state:', {
        id: plan.id,
        name: plan.name,
        owner: plan.owner,
        startDate: plan.startDate,
        endDate: plan.endDate,
        status: plan.status,
        productId: plan.productId,
        itOwner: plan.itOwner,
        componentsCount: plan.components?.length || 0,
        components: plan.components?.map((c: any) => ({
          componentId: c.componentId,
          finalVersion: c.finalVersion,
        })),
        phasesCount: plan.phases?.length || 0,
        tasksCount: plan.tasks?.length || 0,
      });
      
      // If it's a validation error from PlanComponentVersion or other validation, wrap it
      if (saveError?.message?.includes('required') || saveError?.message?.includes('is required')) {
        throw new BadRequestException(saveError.message || 'Validation error');
      }
      
      // Re-throw BadRequestException as-is
      if (saveError instanceof BadRequestException) {
        throw saveError;
      }
      
      // For other errors, wrap in a more descriptive error
      throw new Error(`Error saving plan: ${saveError?.message || String(saveError)}`);
    }
  }

  async delete(id: string): Promise<void> {
    // Defensive: Validate ID
    validateId(id, 'Plan');
    
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundException('Plan', id);
    }
    await this.repository.delete(id);
  }

  /**
   * Transactional method to update plan and features status atomically
   * This ensures that both operations succeed or fail together (ACID)
   * Uses optimistic locking for both plan and features
   */
  async updatePlanWithFeaturesTransactionally(
    planId: string,
    planDto: UpdatePlanDto,
    featureUpdates: Array<{ id: string; status: FeatureStatus; updatedAt: string }>,
  ): Promise<PlanResponseDto> {
    // Defensive: Validate inputs
    validateId(planId, 'Plan');
    validateObject(planDto, 'UpdatePlanDto');
    if (featureUpdates && !Array.isArray(featureUpdates)) {
      throw new Error('Feature updates must be an array');
    }

    // Use transaction to ensure atomicity
    // Access the EntityManager through the repository's manager property
    const planRepo = this.repository as any;
    if (!planRepo.repository || !planRepo.repository.manager) {
      throw new Error('Repository manager not available for transactions');
    }
    
    return await planRepo.repository.manager.transaction(async (transactionalEntityManager) => {
      // Step 1: Load plan with optimistic locking check
      const plan = await transactionalEntityManager.findOne(Plan, {
        where: { id: planId } as any,
      });

      if (!plan) {
        throw new NotFoundException('Plan', planId);
      }

      // Optimistic locking: Check if plan was modified since client last fetched it
      if (planDto.updatedAt) {
        const clientUpdatedAt = new Date(planDto.updatedAt);
        const serverUpdatedAt = new Date(plan.updatedAt);
        
        const timeDiff = Math.abs(serverUpdatedAt.getTime() - clientUpdatedAt.getTime());
        if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
          throw new ConflictException(
            'Plan was modified by another user. Please refresh and try again.',
            'CONCURRENT_MODIFICATION',
          );
        }
      }

      // Step 2: Update plan fields (simplified - full update logic would go here)
      if (planDto.name) {
        plan.name = planDto.name.trim().replace(/\s+/g, ' ');
      }
      if (planDto.description !== undefined) {
        plan.description = planDto.description;
      }
      if (planDto.status) {
        plan.status = planDto.status;
      }
      if (planDto.startDate) {
        plan.startDate = new Date(planDto.startDate);
      }
      if (planDto.endDate) {
        plan.endDate = new Date(planDto.endDate);
      }
      if (planDto.featureIds) {
        plan.featureIds = planDto.featureIds;
      }

      // Step 3: Update features status with optimistic locking
      if (featureUpdates && featureUpdates.length > 0) {
        for (const featureUpdate of featureUpdates) {
          const feature = await transactionalEntityManager.findOne(Feature, {
            where: { id: featureUpdate.id } as any,
          });

          if (!feature) {
            throw new NotFoundException('Feature', featureUpdate.id);
          }

          // Optimistic locking: Check if feature was modified since client last fetched it
          const clientUpdatedAt = new Date(featureUpdate.updatedAt);
          const serverUpdatedAt = new Date(feature.updatedAt);
          
          const timeDiff = Math.abs(serverUpdatedAt.getTime() - clientUpdatedAt.getTime());
          if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
            throw new ConflictException(
              `Feature ${featureUpdate.id} was modified by another user. Please refresh and try again.`,
              'CONCURRENT_MODIFICATION',
            );
          }

          // Update feature status
          feature.status = featureUpdate.status;
          await transactionalEntityManager.save(Feature, feature);
        }
      }

      // Step 4: Save plan (all changes are committed atomically)
      const savedPlan = await transactionalEntityManager.save(Plan, plan);
      
      if (!savedPlan) {
        throw new Error('Failed to save plan');
      }

      return new PlanResponseDto(savedPlan);
    });
  }

  /**
   * Transactional method to update plan and component versions atomically
   * This ensures that both operations succeed or fail together (ACID)
   * Uses optimistic locking for both plan and product/components
   * Updates component versions: previousVersion = currentVersion, currentVersion = finalVersion
   */
  async updatePlanWithComponentsTransactionally(
    planId: string,
    planDto: UpdatePlanDto,
    componentUpdates: Array<{ id: string; finalVersion: string; updatedAt: string }>,
    productId: string,
    productUpdatedAt: string,
  ): Promise<PlanResponseDto> {
    // Defensive: Validate inputs
    validateId(planId, 'Plan');
    validateObject(planDto, 'UpdatePlanDto');
    validateId(productId, 'Product');
    if (componentUpdates && !Array.isArray(componentUpdates)) {
      throw new Error('Component updates must be an array');
    }

    // Use transaction to ensure atomicity
    const planRepo = this.repository as any;
    if (!planRepo.repository || !planRepo.repository.manager) {
      throw new Error('Repository manager not available for transactions');
    }
    
    return await planRepo.repository.manager.transaction(async (transactionalEntityManager) => {
      // Step 1: Load plan with optimistic locking check
      const plan = await transactionalEntityManager.findOne(Plan, {
        where: { id: planId } as any,
      });

      if (!plan) {
        throw new NotFoundException('Plan', planId);
      }

      // Optimistic locking: Check if plan was modified since client last fetched it
      if (planDto.updatedAt) {
        const clientUpdatedAt = new Date(planDto.updatedAt);
        const serverUpdatedAt = new Date(plan.updatedAt);
        
        const timeDiff = Math.abs(serverUpdatedAt.getTime() - clientUpdatedAt.getTime());
        if (timeDiff > 1000 && serverUpdatedAt > clientUpdatedAt) {
          throw new ConflictException(
            'Plan was modified by another user. Please refresh and try again.',
            'CONCURRENT_MODIFICATION',
          );
        }
      }

      // Step 2: Load product with optimistic locking check
      const product = await transactionalEntityManager.findOne(Product, {
        where: { id: productId } as any,
        relations: ['components', 'components.componentType'],
      });

      if (!product) {
        throw new NotFoundException('Product', productId);
      }

      // Optimistic locking: Check if product was modified since client last fetched it
      const clientProductUpdatedAt = new Date(productUpdatedAt);
      const serverProductUpdatedAt = new Date(product.updatedAt);
      
      const productTimeDiff = Math.abs(serverProductUpdatedAt.getTime() - clientProductUpdatedAt.getTime());
      if (productTimeDiff > 1000 && serverProductUpdatedAt > clientProductUpdatedAt) {
        throw new ConflictException(
          'Product was modified by another user. Please refresh and try again.',
          'CONCURRENT_MODIFICATION',
        );
      }

      // Step 3: Store previous components for version history comparison
      const previousComponents = plan.components || [];
      const previousComponentsMap = new Map(
        previousComponents.map((c) => [c.componentId, c.finalVersion])
      );
      
      // Step 4: Update plan components
      if (planDto.components) {
        plan.components = planDto.components;
      }

      // Step 5: Update component versions atomically and create version history
      if (componentUpdates && componentUpdates.length > 0) {
        for (const componentUpdate of componentUpdates) {
          const component = product.components.find((c) => c.id === componentUpdate.id);
          
          if (!component) {
            throw new NotFoundException('Component', componentUpdate.id);
          }

          // Optimistic locking: Check if component was modified since client last fetched it
          const clientComponentUpdatedAt = new Date(componentUpdate.updatedAt);
          const serverComponentUpdatedAt = new Date(component.updatedAt);
          
          const componentTimeDiff = Math.abs(serverComponentUpdatedAt.getTime() - clientComponentUpdatedAt.getTime());
          if (componentTimeDiff > 1000 && serverComponentUpdatedAt > clientComponentUpdatedAt) {
            throw new ConflictException(
              `Component ${componentUpdate.id} was modified by another user. Please refresh and try again.`,
              'CONCURRENT_MODIFICATION',
            );
          }

          // Get previous version from plan components or use currentVersion from product
          const previousVersion = previousComponentsMap.get(componentUpdate.id) || component.currentVersion;
          
          // Only create history record if version changed
          if (previousVersion !== componentUpdate.finalVersion) {
            const versionHistory = new PlanComponentVersion(
              plan.id,
              product.id,
              componentUpdate.id,
              previousVersion, // oldVersion: previous finalVersion or currentVersion
              componentUpdate.finalVersion // newVersion: new finalVersion
            );
            
            await transactionalEntityManager.save(PlanComponentVersion, versionHistory);
          }

          // Update component versions: previousVersion = currentVersion, currentVersion = finalVersion
          component.previousVersion = component.currentVersion; // currentVersion becomes previousVersion
          component.currentVersion = componentUpdate.finalVersion; // finalVersion becomes new currentVersion
          
          await transactionalEntityManager.save(ComponentVersion, component);
        }
      }
      
      // Step 6: Also create history records for components that are new (not in componentUpdates but in planDto.components)
      if (planDto.components) {
        const componentUpdateIds = new Set(componentUpdates?.map((c) => c.id) || []);
        
        for (const planComp of planDto.components) {
          // Skip if already processed in componentUpdates
          if (componentUpdateIds.has(planComp.componentId)) {
            continue;
          }
          
          // This is a new component being added to the plan
          const component = product.components.find((c) => c.id === planComp.componentId);
          
          if (component) {
            // Get previous version (should be empty or currentVersion from product)
            const previousVersion = previousComponentsMap.get(planComp.componentId) || component.currentVersion;
            
            // Create history record for new component assignment
            const versionHistory = new PlanComponentVersion(
              plan.id,
              product.id,
              planComp.componentId,
              previousVersion, // oldVersion: currentVersion from product
              planComp.finalVersion // newVersion: finalVersion assigned to plan
            );
            
            await transactionalEntityManager.save(PlanComponentVersion, versionHistory);
          }
        }
      }

      // Step 7: Save plan and product (all changes are committed atomically)
      const savedPlan = await transactionalEntityManager.save(Plan, plan);
      const savedProduct = await transactionalEntityManager.save(Product, product);
      
      if (!savedPlan) {
        throw new Error('Failed to save plan');
      }
      if (!savedProduct) {
        throw new Error('Failed to save product');
      }

      return new PlanResponseDto(savedPlan);
    });
  }
}

