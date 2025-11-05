import { vi, it, expect } from "vitest";
import { render, screen, fireEvent } from "../../../../test/test-utils";
import GanttChart from "./GanttChart";
import type { PlanPhase } from "../../types";

it("calls onPhaseRangeChange after drag selection", () => {
  const cb = vi.fn();
  const phases: PlanPhase[] = [{ id: "ph", name: "Phase A" }];
  render(
    <GanttChart
      startDate="2025-01-01"
      endDate="2025-12-31"
      tasks={[]}
      phases={phases}
      onPhaseRangeChange={cb}
    />
  );
  const overlay = screen.getByTitle(/Drag to set Phase A period/);
  fireEvent.mouseDown(overlay, { clientX: 0, clientY: 0 });
  fireEvent.mouseMove(document, { clientX: 100, clientY: 0 });
  fireEvent.mouseUp(document);
  expect(cb).toHaveBeenCalled();
});
