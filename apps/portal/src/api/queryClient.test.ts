import { describe, it, expect } from 'vitest';
import { queryClient } from './queryClient';

describe('queryClient', () => {
  it('has expected defaults', () => {
    const opts = queryClient.getDefaultOptions();
    expect(opts.queries?.staleTime).toBe(60 * 1000);
    expect(opts.queries?.refetchOnWindowFocus).toBe(false);
    expect(opts.queries?.retry).toBe(1);
  });
});


