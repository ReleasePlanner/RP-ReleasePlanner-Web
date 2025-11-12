import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ReleasePlansState, Plan, PlanPhase, BasePhase } from "./types";
import { getNextDistinctColor } from "./lib/colors";

/**
 * Converts a BasePhase to a PlanPhase
 * BasePhase doesn't have dates, so we need to create a PlanPhase without dates initially
 * Each phase gets a unique ID based on timestamp and base phase ID
 */
function basePhaseToPlanPhase(basePhase: BasePhase, index: number): PlanPhase {
  return {
    id: `phase-${Date.now()}-${index}-${basePhase.id}`,
    name: basePhase.name,
    color: basePhase.color,
    // startDate and endDate will be set later by the user or auto-generated
  };
}

const initialState: ReleasePlansState = {
  plans: [
    {
      id: "plan-1",
      metadata: {
        id: "plan-1",
        name: "Q1 Release",
        owner: "Product Team",
        startDate: "2025-01-06",
        endDate: "2025-03-28",
        status: "in_progress",
        description: "Core features and stability improvements.",
        // phases will be loaded from basePhases automatically
        phases: [],
      },
      tasks: [
        {
          id: "t1",
          title: "Discovery",
          startDate: "2025-01-06",
          endDate: "2025-01-17",
        },
        {
          id: "t2",
          title: "Development",
          startDate: "2025-01-20",
          endDate: "2025-03-07",
        },
        {
          id: "t3",
          title: "Stabilization",
          startDate: "2025-03-10",
          endDate: "2025-03-21",
        },
      ],
    },
    {
      id: "plan-2",
      metadata: {
        id: "plan-2",
        name: "Q2 Release",
        owner: "Platform Team",
        startDate: "2025-04-07",
        endDate: "2025-06-27",
        status: "planned",
        // phases will be loaded from basePhases automatically
        phases: [],
      },
      tasks: [
        {
          id: "t4",
          title: "Planning",
          startDate: "2025-04-07",
          endDate: "2025-04-18",
        },
        {
          id: "t5",
          title: "Execution",
          startDate: "2025-04-21",
          endDate: "2025-06-13",
        },
        {
          id: "t6",
          title: "Hardening",
          startDate: "2025-06-16",
          endDate: "2025-06-27",
        },
      ],
    },
  ],
};

const releasePlansSlice = createSlice({
  name: "releasePlans",
  initialState,
  reducers: {
    addPlan(
      state,
      action: PayloadAction<{
        plan: Plan;
        basePhases?: BasePhase[];
      }>
    ) {
      const { plan, basePhases } = action.payload;

      // If plan doesn't have phases and basePhases are provided, load them
      if (!plan.metadata.phases || plan.metadata.phases.length === 0) {
        if (basePhases && basePhases.length > 0) {
          plan.metadata.phases = basePhases.map((bp, index) =>
            basePhaseToPlanPhase(bp, index)
          );
        }
      }

      state.plans.push(plan);
    },
    updatePlan(state, action: PayloadAction<Plan>) {
      const idx = state.plans.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.plans[idx] = action.payload;
    },
    removePlan(state, action: PayloadAction<{ id: string }>) {
      state.plans = state.plans.filter((p) => p.id !== action.payload.id);
    },
    addPhase(state, action: PayloadAction<{ planId: string; name: string }>) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan) return;
      if (!plan.metadata.phases) plan.metadata.phases = [];
      const name = action.payload.name.trim();
      if (!name) return;

      // Validate that the phase name is unique within this plan
      const existingPhaseNames = (plan.metadata.phases ?? []).map((ph) =>
        ph.name.toLowerCase().trim()
      );
      const normalizedName = name.toLowerCase().trim();

      // If a phase with this name already exists, don't add it
      if (existingPhaseNames.includes(normalizedName)) {
        return; // Silently skip - validation should happen in UI
      }

      const usedColors = (plan.metadata.phases ?? []).map((ph) => ph.color);
      const today = new Date();
      const weekLater = new Date(today);
      weekLater.setDate(weekLater.getDate() + 7);
      const startIso = today.toISOString().slice(0, 10);
      const endIso = weekLater.toISOString().slice(0, 10);
      const newPhase: PlanPhase = {
        id: `phase-${Date.now()}`,
        name,
        startDate: startIso,
        endDate: endIso,
        color: getNextDistinctColor(usedColors, plan.metadata.phases.length),
      };
      plan.metadata.phases.push(newPhase);
    },
    removePhase(
      state,
      action: PayloadAction<{ planId: string; phaseId: string }>
    ) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan || !plan.metadata.phases) return;
      plan.metadata.phases = plan.metadata.phases.filter(
        (ph) => ph.id !== action.payload.phaseId
      );
    },
    updatePhase(
      state,
      action: PayloadAction<{
        planId: string;
        phaseId: string;
        changes: Partial<PlanPhase>;
      }>
    ) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan || !plan.metadata.phases) return;
      const ph = plan.metadata.phases.find(
        (x) => x.id === action.payload.phaseId
      );
      if (!ph) return;
      Object.assign(ph, action.payload.changes);
    },
    /**
     * Replaces all phases of a specific plan with base phases
     */
    replacePlanPhasesWithBase(
      state,
      action: PayloadAction<{
        planId: string;
        basePhases: BasePhase[];
      }>
    ) {
      const plan = state.plans.find((p) => p.id === action.payload.planId);
      if (!plan || !action.payload.basePhases.length) return;

      // Replace all existing phases with base phases
      plan.metadata.phases = action.payload.basePhases.map((bp, index) =>
        basePhaseToPlanPhase(bp, index)
      );
    },
    /**
     * Replaces all phases of all existing plans with base phases
     */
    replaceAllPlansPhasesWithBase(
      state,
      action: PayloadAction<{
        basePhases: BasePhase[];
      }>
    ) {
      if (!action.payload.basePhases.length) return;

      // Replace phases for all plans
      state.plans.forEach((plan) => {
        plan.metadata.phases = action.payload.basePhases.map((bp, index) =>
          basePhaseToPlanPhase(bp, index)
        );
      });
    },
  },
});

export const {
  addPlan,
  updatePlan,
  removePlan,
  addPhase,
  removePhase,
  updatePhase,
  replacePlanPhasesWithBase,
  replaceAllPlansPhasesWithBase,
} = releasePlansSlice.actions;
export const releasePlansReducer = releasePlansSlice.reducer;
