import { vi, it, expect, describe } from "vitest";
import { render, screen, fireEvent } from "../../../../test/test-utils";
import GanttChart from "./GanttChart";
import type { PlanPhase } from "../../types";

describe("GanttChart phase bar drag/resize", () => {
  const phase: PlanPhase = {
    id: "ph1",
    name: "Phase A",
    startDate: "2025-01-05",
    endDate: "2025-01-08",
    color: "#185ABD",
  };

  it("calls onPhaseRangeChange when moving a phase bar", () => {
    const spy = vi.fn();
    render(
      <GanttChart
        startDate="2025-01-01"
        endDate="2025-12-31"
        tasks={[]}
        phases={[phase]}
        onPhaseRangeChange={spy}
      />
    );

    const moveHandle = screen.getByTestId("phasebar-move-ph1");
    fireEvent.mouseDown(moveHandle, { clientX: 10 });
    fireEvent.mouseMove(window, { clientX: 60 });
    fireEvent.mouseUp(window, { clientX: 60 });

    expect(spy).toHaveBeenCalled();
  });

  it("calls onPhaseRangeChange when resizing a phase bar (right)", () => {
    const spy = vi.fn();
    render(
      <GanttChart
        startDate="2025-01-01"
        endDate="2025-12-31"
        tasks={[]}
        phases={[phase]}
        onPhaseRangeChange={spy}
      />
    );

    const rightHandle = screen.getByTestId("phasebar-resize-right-ph1");
    fireEvent.mouseDown(rightHandle, { clientX: 30 });
    fireEvent.mouseMove(window, { clientX: 120 });
    fireEvent.mouseUp(window, { clientX: 120 });

    expect(spy).toHaveBeenCalled();
  });
});
