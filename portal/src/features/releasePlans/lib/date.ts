export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function startOfWeekMonday(d: Date): Date {
  const res = new Date(d);
  const day = res.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  res.setDate(res.getDate() + diff);
  res.setHours(0, 0, 0, 0);
  return res;
}

export function buildDaysArray(start: Date, totalDays: number): Date[] {
  return Array.from({ length: totalDays }, (_, i) => addDays(start, i));
}

export type Segment = { label: string; startIndex: number; length: number };

export function buildMonthSegments(days: Date[]): Segment[] {
  if (days.length === 0) return [];
  const segments: Segment[] = [];
  let currentLabel = `${days[0].toLocaleString('en-US', { month: 'short' })} ${days[0].getFullYear()}`;
  let startIdx = 0;
  for (let i = 1; i < days.length; i++) {
    const d = days[i];
    const label = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
    if (label !== currentLabel) {
      segments.push({ label: currentLabel, startIndex: startIdx, length: i - startIdx });
      currentLabel = label;
      startIdx = i;
    }
  }
  segments.push({ label: currentLabel, startIndex: startIdx, length: days.length - startIdx });
  return segments;
}

export function buildWeekSegments(days: Date[]): Segment[] {
  if (days.length === 0) return [];
  const segments: Segment[] = [];
  let currentWeekStart = startOfWeekMonday(days[0]).toISOString().slice(0, 10);
  let startIdx = 0;
  for (let i = 1; i < days.length; i++) {
    const ws = startOfWeekMonday(days[i]).toISOString().slice(0, 10);
    if (ws !== currentWeekStart) {
      const labelDate = new Date(currentWeekStart);
      const label = labelDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
      segments.push({ label, startIndex: startIdx, length: i - startIdx });
      currentWeekStart = ws;
      startIdx = i;
    }
  }
  const lastLabelDate = new Date(currentWeekStart);
  const lastLabel = lastLabelDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  segments.push({ label: lastLabel, startIndex: startIdx, length: days.length - startIdx });
  return segments;
}
