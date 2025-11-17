/**
 * Plan Type Converters
 *
 * Converts between local Plan format (with metadata) and API Plan format (flat structure)
 */

import type {
  Plan as LocalPlan,
  PlanReferenceType,
  GanttCellData,
} from "../types";
import type {
  Plan as APIPlan,
  UpdatePlanDto,
} from "../../../api/services/plans.service";

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
      components: (apiPlan.components || []).map((c) => ({
        componentId: c.componentId,
        currentVersion: "", // API doesn't provide currentVersion, set empty string
        finalVersion: c.finalVersion,
      })),
      calendarIds: apiPlan.calendarIds || [],
      milestones: apiPlan.milestones?.map((m) => ({
        phaseId: m.phaseId,
        id: m.id,
        date: m.date,
        name: m.name,
        description: m.description,
      })),
      references: (() => {
        const apiReferences = apiPlan.references || [];

        // Debug: Log references from API - always log to see what's happening
        console.log("[planConverters] Converting references from API:", {
          planId: apiPlan.id,
          planName: apiPlan.name,
          apiReferences: apiReferences,
          apiReferencesLength: apiReferences.length,
          apiReferencesType: typeof apiReferences,
          isArray: Array.isArray(apiReferences),
          references:
            apiReferences.length > 0
              ? apiReferences.map((r) => ({
                  id: r.id,
                  type: r.type,
                  title: r.title,
                  createdAt: r.createdAt,
                  updatedAt: r.updatedAt,
                }))
              : [],
        });

        const filteredReferences = apiReferences.filter(
          (r) =>
            r.type === "link" ||
            r.type === "document" ||
            r.type === "note" ||
            r.type === "milestone"
        );

        console.log("[planConverters] After filtering references:", {
          originalCount: apiReferences.length,
          filteredCount: filteredReferences.length,
          filteredReferences: filteredReferences.map((r) => ({
            id: r.id,
            type: r.type,
            title: r.title,
          })),
        });

        const mappedReferences = filteredReferences.map((r) => {
          // Helper function to safely convert dates to ISO strings
          const toISOString = (
            date: string | Date | null | undefined
          ): string => {
            if (!date) {
              // If date is null/undefined, return current date as fallback
              return new Date().toISOString();
            }
            if (typeof date === "string") {
              // If it's already a string, validate it can be parsed
              const parsed = new Date(date);
              if (Number.isNaN(parsed.getTime())) {
                // Invalid date string, return current date as fallback
                return new Date().toISOString();
              }
              return date; // Valid date string, return as-is
            }
            // If it's a Date object, convert to ISO string
            const dateObj = new Date(date);
            if (Number.isNaN(dateObj.getTime())) {
              // Invalid date, return current date as fallback
              return new Date().toISOString();
            }
            return dateObj.toISOString();
          };

          return {
            id: r.id,
            type: r.type as PlanReferenceType,
            title: r.title,
            url: r.url,
            description: r.description,
            // Convert Date objects to ISO strings if needed, with validation
            createdAt: toISOString(r.createdAt),
            updatedAt: toISOString(r.updatedAt),
            date: r.date,
            phaseId: r.phaseId,
            milestoneColor: r.milestoneColor, // Include milestoneColor from API
          };
        });

        console.log("[planConverters] Final mapped references:", {
          count: mappedReferences.length,
          references: mappedReferences.map((r) => ({
            id: r.id,
            type: r.type,
            title: r.title,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          })),
        });

        return mappedReferences;
      })(),
      cellData: (() => {
        // Start with existing cellData from API
        const existingCellData =
          apiPlan.cellData?.map((c) => ({
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
          })) || [];

        // Sync milestone references with cellData
        // Ensure that milestone references have corresponding cellData entries
        const milestoneReferences =
          apiPlan.references?.filter((r) => r.type === "milestone" && r.date) ||
          [];

        const cellDataMap = new Map<string, GanttCellData>();
        for (const cell of existingCellData) {
          const key = `${cell.phaseId || ""}-${cell.date}`;
          cellDataMap.set(key, cell);
        }

        for (const milestoneRef of milestoneReferences) {
          if (!milestoneRef.date) continue;
          const key = `${milestoneRef.phaseId || ""}-${milestoneRef.date}`;
          const existingCell = cellDataMap.get(key);
          if (existingCell) {
            // Update existing cellData to mark as milestone
            cellDataMap.set(key, {
              ...existingCell,
              isMilestone: true,
              milestoneColor:
                milestoneRef.milestoneColor ||
                existingCell.milestoneColor ||
                "#F44336",
            });
          } else {
            // Create new cellData entry for milestone reference
            cellDataMap.set(key, {
              phaseId: milestoneRef.phaseId,
              date: milestoneRef.date,
              isMilestone: true,
              milestoneColor: milestoneRef.milestoneColor || "#F44336",
            });
          }
        }

        return Array.from(cellDataMap.values());
      })(),
    },
    tasks:
      apiPlan.tasks?.map((t) => ({
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
export function convertLocalPlanToUpdateDto(
  localPlan: LocalPlan
): UpdatePlanDto {
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

// Helper functions to reduce cognitive complexity
function mapPhasesToDto(phases: LocalPlan["metadata"]["phases"]) {
  return phases?.map((p) => ({
    name: p.name,
    startDate: p.startDate,
    endDate: p.endDate,
    color: p.color,
  }));
}

function mapMilestonesToDto(milestones: LocalPlan["metadata"]["milestones"]) {
  return milestones?.map((m) => ({
    name: m.name,
    date: m.date,
    description: m.description,
    phaseId: m.phaseId,
  }));
}

function mapCellDataToDto(cellData: LocalPlan["metadata"]["cellData"]) {
  return cellData?.map((c) => ({
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
  }));
}

function mapReferencesToDto(references: LocalPlan["metadata"]["references"]) {
  return references?.map((r) => ({
    type: r.type,
    title: r.title,
    url: r.url,
    description: r.description,
    date: r.date,
    phaseId: r.phaseId,
    // Include milestoneColor for milestone type references
    ...(r.type === "milestone" &&
      r.milestoneColor && { milestoneColor: r.milestoneColor }),
  }));
}

function formatUpdatedAt(updatedAt?: Date | string): string | undefined {
  if (!updatedAt) return undefined;
  return typeof updatedAt === "string" ? updatedAt : updatedAt.toISOString();
}

/**
 * Create a partial UpdatePlanDto from local plan changes
 * @param localPlan - The local plan object
 * @param changes - Partial changes to apply
 * @param originalUpdatedAt - Optional original updatedAt for optimistic locking
 */
export function createPartialUpdateDto(
  localPlan: LocalPlan,
  changes: Partial<LocalPlan["metadata"]>,
  originalUpdatedAt?: Date | string
): UpdatePlanDto {
  const dto: UpdatePlanDto & { updatedAt?: string } = {};

  // Simple field mappings - using a more functional approach
  const simpleFields: Array<keyof LocalPlan["metadata"]> = [
    "name",
    "owner",
    "startDate",
    "endDate",
    "status",
    "description",
    "productId",
    "itOwner",
    "featureIds",
    "calendarIds",
    "components",
  ];

  for (const field of simpleFields) {
    if (changes[field] !== undefined) {
      dto[field as keyof UpdatePlanDto] = changes[field] as never;
    }
  }

  // Complex field mappings using helper functions
  if (changes.phases !== undefined) {
    dto.phases = mapPhasesToDto(changes.phases);
  }
  if (changes.milestones !== undefined) {
    dto.milestones = mapMilestonesToDto(changes.milestones);
  }
  if (changes.cellData !== undefined) {
    dto.cellData = mapCellDataToDto(changes.cellData);
  }
  if (changes.references !== undefined) {
    dto.references = mapReferencesToDto(changes.references);
  }

  // Include updatedAt for optimistic locking
  const formattedUpdatedAt = formatUpdatedAt(originalUpdatedAt);
  if (formattedUpdatedAt) {
    (dto as UpdatePlanDto & { updatedAt: string }).updatedAt =
      formattedUpdatedAt;
  }

  return dto;
}

/**
 * Create UpdatePlanDto with full plan data (for complete updates)
 */
export function createFullUpdateDto(
  localPlan: LocalPlan,
  originalUpdatedAt?: Date | string
): UpdatePlanDto {
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
    // Include updatedAt for optimistic locking
    ...(originalUpdatedAt && {
      updatedAt:
        typeof originalUpdatedAt === "string"
          ? originalUpdatedAt
          : originalUpdatedAt.toISOString(),
    }),
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
      phaseId: m.phaseId,
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
      ...(r.type === "milestone" &&
        r.milestoneColor && { milestoneColor: r.milestoneColor }),
    })),
  };
}
