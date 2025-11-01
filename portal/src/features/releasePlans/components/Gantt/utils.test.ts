import { describe, it, expect } from 'vitest';
import { laneTop, computeTodayIndex, dayIndexFromClientX } from './utils';

describe('Gantt utils', () => {
  it('laneTop computes top with gap and track height', () => {
    expect(laneTop(0)).toBeGreaterThan(0);
    expect(laneTop(1)).toBeGreaterThan(laneTop(0));
  });

  it('computeTodayIndex returns undefined when out of range', () => {
    const start = new Date('2000-01-01');
    const end = new Date('2000-12-31');
    // Today is outside 2000
    expect(computeTodayIndex(start, end, 366)).toBeUndefined();
  });

  it('dayIndexFromClientX maps clientX to clamped day index', () => {
    const container = document.createElement('div');
    const content = document.createElement('div');
    (content as any).getBoundingClientRect = () => ({ left: 100 } as any);
    // 24 px per day; clientX 148 => rel 48 => index 2
    const idx = dayIndexFromClientX(148, container, content, 24, 5);
    expect(idx).toBe(2);
  });
});


