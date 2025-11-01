import { addDays, daysBetween } from "./date";
import type { PlanPhase } from "../types";
import { getNextDistinctColor } from "./colors";

const DEFAULT_TEMPLATES = [
  { name: "Discovery" },
  { name: "Planning" },
  { name: "Development" },
  { name: "Testing" },
  { name: "UAT" },
  { name: "Release" },
];

export function generatePhases(
  startDate: string,
  endDate: string,
  template = DEFAULT_TEMPLATES
): PlanPhase[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const total = Math.max(1, daysBetween(start, end));
  const n = Math.max(1, template.length);
  const baseLen = Math.floor(total / n) || 1;
  const remainder = total - baseLen * n;

  const phases: PlanPhase[] = [];
  let cursor = new Date(start);
  const usedColors: Array<string | undefined> = [];
  for (let i = 0; i < n; i++) {
    const len = baseLen + (i < remainder ? 1 : 0);
    const s = new Date(cursor);
    const e = new Date(addDays(s, Math.max(1, len)));
    const id = `phase-${Date.now()}-${i}`;
    const color = getNextDistinctColor(usedColors, i);
    phases.push({
      id,
      name: template[i].name,
      startDate: s.toISOString().slice(0, 10),
      endDate: e.toISOString().slice(0, 10),
      color,
    });
    usedColors.push(color);
    cursor = new Date(e);
  }
  // Ensure last phase ends exactly on endDate
  if (phases.length)
    phases[phases.length - 1].endDate = end.toISOString().slice(0, 10);
  return phases;
}
