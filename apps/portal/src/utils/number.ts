export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (min > max) return value;
  return Math.min(max, Math.max(min, value));
}


