/**
 * Tests for shared-utils index exports
 */

import { sharedUtils } from './lib/shared-utils';

describe('shared-utils index', () => {
  it('should export sharedUtils function', () => {
    expect(sharedUtils).toBeDefined();
    expect(typeof sharedUtils).toBe('function');
  });

  it('should return correct string', () => {
    expect(sharedUtils()).toBe('shared-utils');
  });
});

