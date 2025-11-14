/**
 * Plan Type Converters
 * 
 * Converts between local Plan format (with metadata) and API Plan format (flat structure)
 */

import type { Plan as LocalPlan, PlanPhase, PlanTask, PlanMilestone, PlanReference, GanttCellData, PlanComponent } from "../types";
import type { Plan as APIPlan, PlanPhase as APIPlanPhase, PlanTask as APIPlanTask, PlanMilestone as APIPlanMilestone, PlanReference as APIPlanReference, GanttCellData as APIGanttCellData } from "../../../api/services/plans.service";
import type { UpdatePlanDto } from "../../../api/services/plans.service";

/**
 * Convert API Plan to Local Plan format
 */
export function convertAPIPlanToLocal(apiPlan: APIPlan): LocalPlan {
  return {
    id: apiPlan.id,
    metadata: {
      id: apiPlan.id,
      name: apiPlan.name,
      owner: apiPlan.owner,
      startDate: apiPlan.startDate,
      endDate: apiPlan.endDate,
      status: apiPlan.status,
      description: apiPlan.description,
      phases: apiPlan.phases?.map((p) => ({
        id: p.id,
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        color: p.color,
      })),
      productId: apiPlan.productId,
      itOwner: apiPlan.itOwner,
      featureIds: apiPlan.featureIds || [],
      components: apiPlan.components || [],
      calendarIds: apiPlan.calendarIds || [],
      milestones: apiPlan.milestones?.map((m) => ({
        id: m.id,
        date: m.date,
        name: m.name,
        description: m.description,
      })),
      references: apiPlan.references?.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        url: r.url,
        description: r.description,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        date: r.date,
        phaseId: r.phaseId,
      })),
      cellData: apiPlan.cellData?.map((c) => ({
        id: c.id,
        phaseId: c.phaseId,
        date: c.date,
        isMilestone: c.isMilestone,
        milestoneColor: c.milestoneColor,
        comments: c.comments?.map((cm) => ({
          id: cm.id,
          text: cm.text,
          author: cm.author,
          createdAt: cm.createdAt,
          updatedAt: cm.updatedAt,
        })),
        files: c.files?.map((f) => ({
          id: f.id,
          name: f.name,
          url: f.url,
          size: f.size,
          mimeType: f.mimeType,
          uploadedAt: f.createdAt,
        })),
        links: c.links?.map((l) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          description: l.description,
          createdAt: l.createdAt,
        })),
      })),
    },
    tasks: apiPlan.tasks?.map((t) => ({
      id: t.id,
      title: t.title,
      startDate: t.startDate,
      endDate: t.endDate,
      color: t.color,
    })) || [],
  };
}

/**
 * Convert Local Plan to API UpdatePlanDto format
 */
export function convertLocalPlanToUpdateDto(localPlan: LocalPlan): UpdatePlanDto {
  return {
    name: localPlan.metadata.name,
    owner: localPlan.metadata.owner,
    startDate: localPlan.metadata.startDate,
    endDate: localPlan.metadata.endDate,
    status: localPlan.metadata.status,
    description: localPlan.metadata.description,
    phases: localPlan.metadata.phases?.map((p) => ({
      name: p.name,
      startDate: p.startDate,
      endDate: p.endDate,
      color: p.color,
    })),
    productId: localPlan.metadata.productId,
    itOwner: localPlan.metadata.itOwner,
    featureIds: localPlan.metadata.featureIds,
    calendarIds: localPlan.metadata.calendarIds,
    // Note: milestones, references, cellData, and tasks are managed separately
    // They should be included in the update if needed
  };
}

/**
 * Create a partial UpdatePlanDto from local plan changes
 */
export function createPartialUpdateDto(
  localPlan: LocalPlan,
  changes: Partial<LocalPlan['metadata']>
): UpdatePlanDto {
  return {
    ...(changes.name !== undefined && { name: changes.name }),
    ...(changes.owner !== undefined && { owner: changes.owner }),
    ...(changes.startDate !== undefined && { startDate: changes.startDate }),
    ...(changes.endDate !== undefined && { endDate: changes.endDate }),
    ...(changes.status !== undefined && { status: changes.status }),
    ...(changes.description !== undefined && { description: changes.description }),
    ...(changes.productId !== undefined && { productId: changes.productId }),
    ...(changes.itOwner !== undefined && { itOwner: changes.itOwner }),
    ...(changes.featureIds !== undefined && { featureIds: changes.featureIds }),
    ...(changes.calendarIds !== undefined && { calendarIds: changes.calendarIds }),
    ...(changes.components !== undefined && { components: changes.components }),
    ...(changes.phases !== undefined && {
      phases: changes.phases.map((p) => ({
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        color: p.color,
      })),
    }),
    ...(changes.milestones !== undefined && {
      milestones: changes.milestones.map((m) => ({
        name: m.name,
        date: m.date,
        description: m.description,
      })),
    }),
    ...(changes.cellData !== undefined && {
      cellData: changes.cellData.map((c) => ({
        phaseId: c.phaseId,
        date: c.date,
        isMilestone: c.isMilestone,
        milestoneColor: c.milestoneColor,
        comments: c.comments?.map((cm) => ({
          text: cm.text,
          author: cm.author,
        })),
        files: c.files?.map((f) => ({
          name: f.name,
          url: f.url,
          size: f.size,
          mimeType: f.mimeType,
        })),
        links: c.links?.map((l) => ({
          title: l.title,
          url: l.url,
          description: l.description,
        })),
      })),
    }),
    ...(changes.references !== undefined && {
      references: changes.references.map((r) => ({
        type: r.type,
        title: r.title,
        url: r.url,
        description: r.description,
        date: r.date,
        phaseId: r.phaseId,
      })),
    }),
  };
}

/**
 * Create UpdatePlanDto with full plan data (for complete updates)
 */
export function createFullUpdateDto(localPlan: LocalPlan): UpdatePlanDto {
  return {
    name: localPlan.metadata.name,
    owner: localPlan.metadata.owner,
    startDate: localPlan.metadata.startDate,
    endDate: localPlan.metadata.endDate,
    status: localPlan.metadata.status,
    description: localPlan.metadata.description,
    productId: localPlan.metadata.productId,
    itOwner: localPlan.metadata.itOwner,
    featureIds: localPlan.metadata.featureIds,
    calendarIds: localPlan.metadata.calendarIds,
    components: localPlan.metadata.components,
    phases: localPlan.metadata.phases?.map((p) => ({
      name: p.name,
      startDate: p.startDate,
      endDate: p.endDate,
      color: p.color,
    })),
    milestones: localPlan.metadata.milestones?.map((m) => ({
      name: m.name,
      date: m.date,
      description: m.description,
    })),
    cellData: localPlan.metadata.cellData?.map((c) => ({
      phaseId: c.phaseId,
      date: c.date,
      isMilestone: c.isMilestone,
      milestoneColor: c.milestoneColor,
      comments: c.comments?.map((cm) => ({
        text: cm.text,
        author: cm.author,
      })),
      files: c.files?.map((f) => ({
        name: f.name,
        url: f.url,
        size: f.size,
        mimeType: f.mimeType,
      })),
      links: c.links?.map((l) => ({
        title: l.title,
        url: l.url,
        description: l.description,
      })),
    })),
    references: localPlan.metadata.references?.map((r) => ({
      type: r.type,
      title: r.title,
      url: r.url,
      description: r.description,
      date: r.date,
      phaseId: r.phaseId,
    })),
  };
}

