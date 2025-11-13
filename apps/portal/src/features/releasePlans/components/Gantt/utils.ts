import { clamp } from '../../../../utils/number';
import { relativeClientXToContentX } from '../../../../utils/dom';
import { PX_PER_DAY, TRACK_HEIGHT, LANE_GAP } from './constants';

export function laneTop(index: number): number {
  return LANE_GAP + index * (TRACK_HEIGHT + LANE_GAP);
}

export function computeTodayIndex(start: Date, end: Date, daysLength: number): number | undefined {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  if (t < start || t > end) return undefined;
  const diffDays = Math.floor((t.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return clamp(diffDays, 0, Math.max(0, daysLength - 1));
}

export function dayIndexFromClientX(
  clientX: number,
  containerEl: HTMLElement | null,
  contentEl: HTMLElement | null,
  pxPerDay: number,
  daysLength: number,
): number {
  if (!containerEl || !contentEl) return 0;
  const x = relativeClientXToContentX(clientX, contentEl);
  const idx = Math.floor(x / pxPerDay);
  return clamp(idx, 0, Math.max(0, daysLength - 1));
}

export const GanttDefaults = {
  PX_PER_DAY,
  TRACK_HEIGHT,
  LANE_GAP,
};


