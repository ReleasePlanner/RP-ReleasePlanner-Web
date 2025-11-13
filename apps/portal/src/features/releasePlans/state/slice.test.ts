import { describe, it, expect } from "vitest";
import {
  releasePlansReducer,
  addPlan,
  updatePlan,
  removePlan,
  addPhase,
  removePhase,
  updatePhase,
  replacePlanPhasesWithBase,
  replaceAllPlansPhasesWithBase,
} from "../slice";
import type { ReleasePlansState, Plan } from "../types";
import type { BasePhase } from "../types";

function baseState(): ReleasePlansState {
  return {
    plans: [
      {
        id: "p1",
        metadata: {
          id: "p1",
          name: "Plan 1",
          owner: "Owner",
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          status: "planned",
          phases: [],
        },
        tasks: [],
      },
    ],
  };
}

describe("releasePlans slice", () => {
  it("addPlan appends a plan", () => {
    const plan: Plan = {
      id: "p2",
      metadata: {
        id: "p2",
        name: "P2",
        owner: "O",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: "planned",
      },
      tasks: [],
    };
    const s = releasePlansReducer(baseState(), addPlan({ plan }));
    expect(s.plans.find((p) => p.id === "p2")).toBeTruthy();
  });

  it("updatePlan replaces a plan by id", () => {
    const updated: Plan = {
      id: "p1",
      metadata: {
        id: "p1",
        name: "Renamed",
        owner: "Owner",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: "planned",
      },
      tasks: [],
    };
    const s = releasePlansReducer(baseState(), updatePlan(updated));
    expect(s.plans[0].metadata.name).toBe("Renamed");
  });

  it("removePlan deletes by id", () => {
    const s = releasePlansReducer(baseState(), removePlan({ id: "p1" }));
    expect(s.plans.length).toBe(0);
  });

  it("addPhase adds a phase", () => {
    let s = baseState();
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Phase A" }));
    expect(
      s.plans[0].metadata.phases?.some((ph) => ph.name === "Phase A")
    ).toBe(true);
  });

  it("addPhase defaults dates to today and +7 days", () => {
    let s = baseState();
    const today = new Date();
    const week = new Date(today);
    week.setDate(week.getDate() + 7);
    const startIso = today.toISOString().slice(0, 10);
    const endIso = week.toISOString().slice(0, 10);
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Phase B" }));
    const ph = s.plans[0].metadata.phases!.find((p) => p.name === "Phase B")!;
    expect(ph.startDate).toBe(startIso);
    expect(ph.endDate).toBe(endIso);
  });

  it("updatePhase updates phase fields", () => {
    let s = baseState();
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Phase A" }));
    const phId = s.plans[0].metadata.phases![0].id;
    s = releasePlansReducer(
      s,
      updatePhase({
        planId: "p1",
        phaseId: phId,
        changes: {
          startDate: "2025-02-01",
          endDate: "2025-02-10",
          color: "#000",
        },
      })
    );
    const ph = s.plans[0].metadata.phases![0];
    expect(ph.startDate).toBe("2025-02-01");
    expect(ph.color).toBe("#000");
  });

  it("removePhase deletes a phase", () => {
    let s = baseState();
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Phase A" }));
    const phId = s.plans[0].metadata.phases![0].id;
    s = releasePlansReducer(s, removePhase({ planId: "p1", phaseId: phId }));
    expect(s.plans[0].metadata.phases?.length).toBe(0);
  });

  it("addPhase prevents duplicate phase names (case-insensitive)", () => {
    let s = baseState();
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Phase A" }));
    expect(s.plans[0].metadata.phases?.length).toBe(1);

    // Try to add the same phase name (should be prevented)
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Phase A" }));
    expect(s.plans[0].metadata.phases?.length).toBe(1);

    // Try to add with different case (should be prevented)
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "phase a" }));
    expect(s.plans[0].metadata.phases?.length).toBe(1);

    // Try to add with spaces (should be prevented)
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "  Phase A  " }));
    expect(s.plans[0].metadata.phases?.length).toBe(1);

    // Add a different phase (should work)
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Phase B" }));
    expect(s.plans[0].metadata.phases?.length).toBe(2);
  });

  it("addPhase ignores empty or whitespace-only names", () => {
    let s = baseState();
    const initialLength = s.plans[0].metadata.phases?.length ?? 0;

    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "" }));
    expect(s.plans[0].metadata.phases?.length).toBe(initialLength);

    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "   " }));
    expect(s.plans[0].metadata.phases?.length).toBe(initialLength);
  });

  it("replacePlanPhasesWithBase replaces phases for a specific plan", () => {
    let s = baseState();
    // Add some initial phases
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Old Phase 1" }));
    s = releasePlansReducer(s, addPhase({ planId: "p1", name: "Old Phase 2" }));
    expect(s.plans[0].metadata.phases?.length).toBe(2);

    // Replace with base phases
    const basePhases: BasePhase[] = [
      { id: "base-1", name: "Planning", color: "#1976D2" },
      { id: "base-2", name: "Development", color: "#388E3C" },
    ];
    s = releasePlansReducer(
      s,
      replacePlanPhasesWithBase({ planId: "p1", basePhases })
    );

    expect(s.plans[0].metadata.phases?.length).toBe(2);
    expect(s.plans[0].metadata.phases?.[0].name).toBe("Planning");
    expect(s.plans[0].metadata.phases?.[1].name).toBe("Development");
  });

  it("replaceAllPlansPhasesWithBase replaces phases for all plans", () => {
    let s: ReleasePlansState = {
      plans: [
        {
          id: "p1",
          metadata: {
            id: "p1",
            name: "Plan 1",
            owner: "Owner 1",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "planned",
            phases: [{ id: "old-1", name: "Old Phase", color: "#000" }],
          },
          tasks: [],
        },
        {
          id: "p2",
          metadata: {
            id: "p2",
            name: "Plan 2",
            owner: "Owner 2",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "planned",
            phases: [{ id: "old-2", name: "Old Phase 2", color: "#000" }],
          },
          tasks: [],
        },
      ],
    };

    const basePhases: BasePhase[] = [
      { id: "base-1", name: "Planning", color: "#1976D2" },
      { id: "base-2", name: "Development", color: "#388E3C" },
    ];

    s = releasePlansReducer(s, replaceAllPlansPhasesWithBase({ basePhases }));

    // Both plans should have the base phases
    expect(s.plans[0].metadata.phases?.length).toBe(2);
    expect(s.plans[0].metadata.phases?.[0].name).toBe("Planning");
    expect(s.plans[0].metadata.phases?.[1].name).toBe("Development");

    expect(s.plans[1].metadata.phases?.length).toBe(2);
    expect(s.plans[1].metadata.phases?.[0].name).toBe("Planning");
    expect(s.plans[1].metadata.phases?.[1].name).toBe("Development");
  });

  it("replacePlanPhasesWithBase does nothing if plan not found", () => {
    let s = baseState();
    const initialPhases = s.plans[0].metadata.phases?.length ?? 0;

    const basePhases: BasePhase[] = [
      { id: "base-1", name: "Planning", color: "#1976D2" },
    ];

    s = releasePlansReducer(
      s,
      replacePlanPhasesWithBase({ planId: "non-existent", basePhases })
    );

    expect(s.plans[0].metadata.phases?.length).toBe(initialPhases);
  });

  it("replaceAllPlansPhasesWithBase does nothing if basePhases is empty", () => {
    let s: ReleasePlansState = {
      plans: [
        {
          id: "p1",
          metadata: {
            id: "p1",
            name: "Plan 1",
            owner: "Owner",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            status: "planned",
            phases: [{ id: "old-1", name: "Old Phase", color: "#000" }],
          },
          tasks: [],
        },
      ],
    };

    s = releasePlansReducer(
      s,
      replaceAllPlansPhasesWithBase({ basePhases: [] })
    );

    // Phases should remain unchanged
    expect(s.plans[0].metadata.phases?.length).toBe(1);
    expect(s.plans[0].metadata.phases?.[0].name).toBe("Old Phase");
  });
});
