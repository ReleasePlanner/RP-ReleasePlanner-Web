export type BasePhase = {
  id: string;
  name: string;
  color: string;
};
export type PlanStatus = "planned" | "in_progress" | "done" | "paused";

export type PlanPhase = {
  id: string;
  name: string;
  startDate?: string; // ISO date (optional until set)
  endDate?: string; // ISO date (optional until set)
  color?: string;
};

export type PlanComponent = {
  componentId: string; // ID del componente del producto
  currentVersion: string; // Versión actual del componente en el producto (al momento de asignar al plan)
  finalVersion: string; // Versión final que se usará en el plan
};

export type PlanMilestone = {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  name: string;
  description?: string;
  phaseId?: string; // Phase ID if milestone is associated with a specific phase
};

// Note: GanttCellData, GanttCellComment, GanttCellFile, GanttCellLink have been removed
// References (comments, files, links) are now handled via plan_references table
// with plan_reference_type to specify if they are at plan, period, or day level

// Content type: what the reference contains
export type PlanReferenceType = "link" | "document" | "note" | "milestone";

// Reference level: where the reference is attached (plan, period, day)
export type PlanReferenceLevel = "plan" | "period" | "day";

export type PlanReferenceFile = {
  id: string;
  name: string;
  size: number; // bytes
  type: string; // MIME type
  url?: string; // URL if file is uploaded to server
  file?: File; // File object for new uploads
};

export type PlanReference = {
  id: string;
  type: PlanReferenceType; // Content type: link, document, note, milestone
  title: string;
  url?: string; // For links and documents
  description?: string; // For notes and general description
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
  
  // Reference level: where the reference is attached (plan, period, day)
  planReferenceTypeId?: string; // ID of plan_reference_type (plan, period, day)
  planReferenceType?: { id: string; name: PlanReferenceLevel }; // Reference type details
  
  // For 'period' type: specific day within the period
  periodDay?: string; // ISO date (YYYY-MM-DD)
  
  // For 'day' type: specific calendar day and phase
  calendarDayId?: string; // ID of calendar_day
  calendarDay?: { id: string; name: string; date: string; type: string }; // Calendar day details
  phaseId?: string; // For 'day' type: phase associated with the day
  
  // Legacy fields (kept for backward compatibility)
  date?: string; // ISO date (YYYY-MM-DD) - deprecated, use periodDay or calendarDayId
  
  // For milestone type:
  milestoneColor?: string; // Custom color for milestone marker (hex color, e.g., "#FF5733")
  
  // For document type:
  files?: PlanReferenceFile[]; // Files attached to document reference
};

export type PlanMetadata = {
  id: string;
  name: string;
  owner: string; // Owner name from owners table (via JOIN) - populated from itOwner relationship
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: PlanStatus;
  description?: string;
  phases?: PlanPhase[]; // ordered list of phases
  productId?: string; // ID of the associated product
  itOwner?: string; // IT Owner ID responsible for the plan (references owners table)
  featureIds?: string[]; // IDs of features associated with this plan
  components?: PlanComponent[]; // Components with final versions for this plan
  calendarIds?: string[]; // IDs of calendars associated with this plan
  milestones?: PlanMilestone[]; // Milestones for this plan
  references?: PlanReference[]; // References (links, documents, notes, milestones) for this plan
  // Note: cellData has been removed - references are now handled via plan_references table
};

export type PlanTask = {
  id: string;
  title: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  color?: string; // optional custom color
};

export type Plan = {
  id: string;
  metadata: PlanMetadata;
  tasks: PlanTask[];
  updatedAt?: string; // ISO date string from API for optimistic locking
};

export type ReleasePlansState = {
  plans: Plan[];
};
