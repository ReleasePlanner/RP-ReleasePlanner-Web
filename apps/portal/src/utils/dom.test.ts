import { describe, it, expect, vi } from 'vitest';
import { safeScrollToX, relativeClientXToContentX } from './dom';

describe('dom helpers', () => {
  it('safeScrollToX uses scrollTo when available', () => {
    const el = document.createElement('div') as any;
    const spy = vi.fn();
    el.scrollTo = spy;
    safeScrollToX(el, 123, 'smooth');
    expect(spy).toHaveBeenCalledWith({ left: 123, behavior: 'smooth' });
  });

  it('safeScrollToX falls back to scrollLeft when scrollTo not available', () => {
    const el = document.createElement('div');
    safeScrollToX(el as any, 77, 'auto');
    expect(el.scrollLeft).toBe(77);
  });

  it('relativeClientXToContentX computes relative X', () => {
    const el = document.createElement('div');
    (el as any).getBoundingClientRect = () => ({ left: 250 } as any);
    const x = relativeClientXToContentX(300, el as any);
    expect(x).toBe(50);
  });
});


