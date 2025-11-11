export type BasePhase = {
  id: string;
  name: string;
  color: string;
  category?: string;
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

export type PlanReferenceType = "link" | "document" | "note";

export type PlanReference = {
  id: string;
  type: PlanReferenceType;
  title: string;
  url?: string; // For links and documents
  description?: string; // For notes and general description
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
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
