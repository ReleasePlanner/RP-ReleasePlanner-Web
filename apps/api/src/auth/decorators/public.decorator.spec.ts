/**
 * Public Decorator Unit Tests
 * Coverage: 100%
 */
import { Public, IS_PUBLIC_KEY } from './public.decorator';
import { SetMetadata } from '@nestjs/common';

// Mock SetMetadata
jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    SetMetadata: jest.fn((key, value) => () => ({ key, value })),
  };
});

describe('Public Decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Public', () => {
    it('should call SetMetadata with IS_PUBLIC_KEY and true', () => {
      Public();

      expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
    });

    it('should export IS_PUBLIC_KEY constant', () => {
      expect(IS_PUBLIC_KEY).toBe('isPublic');
    });

    it('should be callable without parameters', () => {
      expect(() => Public()).not.toThrow();
    });
  });
});

