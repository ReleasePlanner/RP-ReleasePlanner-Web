import { vi, it, expect, describe } from "vitest";
import { render, screen, fireEvent } from "../../../../test/test-utils";
import GanttChart from "./GanttChart";
import type { PlanPhase } from "../../types";

describe("GanttChart phase bar double click to edit", () => {
  it("invokes onEditPhase when double clicking a phase bar", () => {
    const onEdit = vi.fn();
    const phase: PlanPhase = {
      id: "ph1",
      name: "Phase A",
      startDate: "2025-03-10",
      endDate: "2025-03-15",
      color: "#185ABD",
    };

    render(
      <GanttChart
        startDate="2025-01-01"
        endDate="2025-12-31"
        tasks={[]}
        phases={[phase]}
        onEditPhase={onEdit}
      />
    );

    const overlay = screen.getByTitle("Drag to set Phase A period");
    fireEvent.doubleClick(overlay);
    expect(onEdit).toHaveBeenCalledWith("ph1");
  });
});
