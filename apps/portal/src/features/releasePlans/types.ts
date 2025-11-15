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
  finalVersion: string; // Versión final que se usará en el plan
};

export type PlanMilestone = {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  name: string;
  description?: string;
};

// Gantt Cell data - represents intersection of phase and day
export type GanttCellComment = {
  id: string;
  text: string;
  author: string;
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
};

export type GanttCellFile = {
  id: string;
  name: string;
  url: string;
  size?: number; // bytes
  mimeType?: string;
  uploadedAt: string; // ISO date
};

export type GanttCellLink = {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: string; // ISO date
};

export type GanttCellData = {
  phaseId?: string; // Optional - if not provided, data is at day level (not phase-specific)
  date: string; // ISO date (YYYY-MM-DD)
  isMilestone?: boolean;
  milestoneColor?: string; // Custom color for milestone marker
  comments?: GanttCellComment[];
  files?: GanttCellFile[];
  links?: GanttCellLink[];
};

export type PlanReferenceType = "link" | "document" | "note" | "comment" | "file" | "milestone";

export type PlanReference = {
  id: string;
  type: PlanReferenceType;
  title: string;
  url?: string; // For links and documents
  description?: string; // For notes and general description
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
  // Optional fields to associate reference with specific day or cell
  date?: string; // ISO date (YYYY-MM-DD) - if set, reference is associated with this specific day
  phaseId?: string; // If set along with date, reference is associated with a specific cell (phase + day)
  // If only date is set (no phaseId), reference is associated with the entire day
  // If neither date nor phaseId is set, reference is at plan level (general)
};

export type PlanMetadata = {
  id: string;
  name: string;
  owner: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: PlanStatus;
  description?: string;
  phases?: PlanPhase[]; // ordered list of phases
  productId?: string; // ID of the associated product
  itOwner?: string; // IT Owner responsible for the plan
  featureIds?: string[]; // IDs of features associated with this plan
  components?: PlanComponent[]; // Components with final versions for this plan
  calendarIds?: string[]; // IDs of calendars associated with this plan
  milestones?: PlanMilestone[]; // Milestones for this plan
  references?: PlanReference[]; // References (links, documents, notes) for this plan
  cellData?: GanttCellData[]; // Cell-specific data (comments, files, links, milestones)
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
};

export type ReleasePlansState = {
  plans: Plan[];
};
