/**
 * Tests for shared-types index exports
 */

import { sharedTypes } from './lib/shared-types';

describe('shared-types index', () => {
  it('should export sharedTypes function', () => {
    expect(sharedTypes).toBeDefined();
    expect(typeof sharedTypes).toBe('function');
  });

  it('should return correct string', () => {
    expect(sharedTypes()).toBe('shared-types');
  });
});

