import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ReleasePlansState, Plan, PlanPhase } from "./types";

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
        phases: [
          { id: "ph-1", name: "Discovery", color: "#185ABD" },
          { id: "ph-2", name: "Planning", color: "#185ABD" },
          { id: "ph-3", name: "Development", color: "#217346" },
          { id: "ph-4", name: "Sprint Testing", color: "#107C41" },
          { id: "ph-5", name: "E2E Testing", color: "#185ABD" },
          { id: "ph-6", name: "Integration Code", color: "#217346" },
          { id: "ph-7", name: "Regression", color: "#107C41" },
          { id: "ph-8", name: "UAT", color: "#185ABD" },
          { id: "ph-9", name: "Review", color: "#217346" },
          { id: "ph-10", name: "Retrospective", color: "#185ABD" },
        ],
      },
      tasks: [
        { id: "t1", title: "Discovery", startDate: "2025-01-06", endDate: "2025-01-17" },
        { id: "t2", title: "Development", startDate: "2025-01-20", endDate: "2025-03-07" },
        { id: "t3", title: "Stabilization", startDate: "2025-03-10", endDate: "2025-03-21" },
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
        phases: [
          { id: "ph-11", name: "Planning", color: "#185ABD" },
          { id: "ph-12", name: "Execution", color: "#217346" },
          { id: "ph-13", name: "Hardening", color: "#107C41" },
        ],
      },
      tasks: [
        { id: "t4", title: "Planning", startDate: "2025-04-07", endDate: "2025-04-18" },
        { id: "t5", title: "Execution", startDate: "2025-04-21", endDate: "2025-06-13" },
        { id: "t6", title: "Hardening", startDate: "2025-06-16", endDate: "2025-06-27" },
      ],
    },
  ],
};

const releasePlansSlice = createSlice({
  name: "releasePlans",
  initialState,
  reducers: {
    addPlan(state, action: PayloadAction<Plan>) {
      state.plans.push(action.payload);
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
      const newPhase: PlanPhase = {
        id: `phase-${Date.now()}`,
        name,
        startDate: plan.metadata.startDate,
        endDate: plan.metadata.endDate,
        // color optional: fall back to theme
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
  },
});

export const {
  addPlan,
  updatePlan,
  removePlan,
  addPhase,
  removePhase,
  updatePhase,
} = releasePlansSlice.actions;
export const releasePlansReducer = releasePlansSlice.reducer;
