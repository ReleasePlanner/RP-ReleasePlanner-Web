import { describe, it, expect } from 'vitest';
import { addDays, daysBetween, startOfWeekMonday, buildDaysArray, buildMonthSegments, buildWeekSegments } from './date';

describe('date helpers', () => {
  it('daysBetween counts whole days ceil', () => {
    const a = new Date('2025-01-01');
    const b = new Date('2025-01-03');
    expect(daysBetween(a, b)).toBe(2);
  });

  it('addDays adds days correctly', () => {
    const a = new Date('2025-01-01');
    const b = addDays(a, 10);
    expect(b.toISOString().slice(0,10)).toBe('2025-01-11');
  });

  it('startOfWeekMonday returns Monday for given date', () => {
    const d = new Date('2025-01-05'); // Sunday
    const m = startOfWeekMonday(d);
    expect(m.getDay()).toBe(1);
  });

  it('buildDaysArray returns expected length', () => {
    const arr = buildDaysArray(new Date('2025-01-01'), 5);
    expect(arr.length).toBe(5);
  });

  it('buildMonthSegments groups by month', () => {
    const days = buildDaysArray(new Date('2025-01-30'), 5); // crosses Jan to Feb
    const segs = buildMonthSegments(days);
    expect(segs.length).toBeGreaterThanOrEqual(2);
  });

  it('buildWeekSegments groups by week start Monday', () => {
    const days = buildDaysArray(new Date('2025-01-01'), 14);
    const segs = buildWeekSegments(days);
    expect(segs.length).toBeGreaterThan(1);
  });
});


