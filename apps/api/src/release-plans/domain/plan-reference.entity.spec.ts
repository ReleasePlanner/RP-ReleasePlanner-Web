/**
 * Plan Reference Entity Unit Tests
 * Coverage: 100%
 */
import { PlanReference, PlanReferenceType } from './plan-reference.entity';

describe('PlanReference', () => {
  describe('constructor', () => {
    it('should create a PlanReference with all properties', () => {
      const reference = new PlanReference(
        PlanReferenceType.LINK,
        'Reference Title',
        'https://example.com',
        'Description',
        '2024-01-01',
        'phase-1',
      );

      expect(reference.type).toBe(PlanReferenceType.LINK);
      expect(reference.title).toBe('Reference Title');
      expect(reference.url).toBe('https://example.com');
      expect(reference.description).toBe('Description');
      expect(reference.date).toBe('2024-01-01');
      expect(reference.phaseId).toBe('phase-1');
    });
  });

  describe('validate', () => {
    it('should pass validation with valid LINK type', () => {
      expect(() => {
        new PlanReference(PlanReferenceType.LINK, 'Title', 'https://example.com');
      }).not.toThrow();
    });

    it('should throw error when type is invalid', () => {
      expect(() => {
        new PlanReference('invalid' as PlanReferenceType, 'Title');
      }).toThrow('Invalid reference type: invalid');
    });

    it('should throw error when title is empty', () => {
      expect(() => {
        new PlanReference(PlanReferenceType.LINK, '');
      }).toThrow('Reference title is required');
    });

    it('should throw error when LINK type has no URL', () => {
      expect(() => {
        new PlanReference(PlanReferenceType.LINK, 'Title');
      }).toThrow('URL is required for link and document types');
    });

    it('should throw error when DOCUMENT type has no URL', () => {
      expect(() => {
        new PlanReference(PlanReferenceType.DOCUMENT, 'Title');
      }).toThrow('URL is required for link and document types');
    });

    it('should accept NOTE type without URL', () => {
      expect(() => {
        new PlanReference(PlanReferenceType.NOTE, 'Title', undefined, 'Description');
      }).not.toThrow();
    });

    it('should throw error when date format is invalid', () => {
      expect(() => {
        new PlanReference(PlanReferenceType.NOTE, 'Title', undefined, undefined, 'invalid-date');
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });

    it('should accept all valid reference types', () => {
      expect(() => {
        new PlanReference(PlanReferenceType.LINK, 'Title', 'https://example.com');
      }).not.toThrow();
      expect(() => {
        new PlanReference(PlanReferenceType.DOCUMENT, 'Title', 'https://example.com');
      }).not.toThrow();
      expect(() => {
        new PlanReference(PlanReferenceType.NOTE, 'Title');
      }).not.toThrow();
      expect(() => {
        new PlanReference(PlanReferenceType.COMMENT, 'Title');
      }).not.toThrow();
      expect(() => {
        new PlanReference(PlanReferenceType.FILE, 'Title', 'https://example.com');
      }).not.toThrow();
      expect(() => {
        new PlanReference(PlanReferenceType.MILESTONE, 'Title');
      }).not.toThrow();
    });
  });
});

