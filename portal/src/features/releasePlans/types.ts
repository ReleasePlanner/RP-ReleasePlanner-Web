export type PlanStatus = "planned" | "in_progress" | "done";

export type PlanPhase = {
  id: string;
  name: string;
  startDate?: string; // ISO date (optional until set)
  endDate?: string; // ISO date (optional until set)
  color?: string;
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
