import { addDays, daysBetween } from "./date";
import type { PlanPhase } from "../types";
import { getNextDistinctColor } from "./colors";
import { DEFAULT_PHASE_TEMPLATE } from "@/constants";

// Helper to convert UTC date string to Date object
function utcStringToDate(utcStr: string): Date {
  const [year, month, day] = utcStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

const DEFAULT_TEMPLATES = DEFAULT_PHASE_TEMPLATE;

export function generatePhases(
  startDate: string, // UTC ISO string (YYYY-MM-DD)
  endDate: string, // UTC ISO string (YYYY-MM-DD)
  template = DEFAULT_TEMPLATES
): PlanPhase[] {
  // Parse UTC dates
  const start = utcStringToDate(startDate);
  const end = utcStringToDate(endDate);
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
    
    // Convert dates back to UTC ISO strings (YYYY-MM-DD)
    const startUTC = s.toISOString().slice(0, 10);
    const endUTC = e.toISOString().slice(0, 10);
    
    phases.push({
      id,
      name: template[i].name,
      startDate: startUTC,
      endDate: endUTC,
      color,
    });
    usedColors.push(color);
    cursor = new Date(e);
  }
  // Ensure last phase ends exactly on endDate (already in UTC)
  if (phases.length)
    phases[phases.length - 1].endDate = endDate;
  return phases;
}
