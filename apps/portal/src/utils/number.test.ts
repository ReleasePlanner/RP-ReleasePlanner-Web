import { describe, it, expect } from 'vitest';
import { clamp } from './number';

describe('clamp', () => {
  it('clamps within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  it('clamps below min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });
  it('clamps above max', () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });
  it('returns min when value is NaN', () => {
    expect(clamp(Number.NaN, 1, 5)).toBe(1);
  });
  it('returns value when min > max (defensive)', () => {
    expect(clamp(7, 10, 0)).toBe(7);
  });
});


