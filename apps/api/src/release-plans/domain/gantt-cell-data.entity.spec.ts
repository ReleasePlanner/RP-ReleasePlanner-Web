/**
 * Gantt Cell Data Entity Unit Tests
 * Coverage: 100%
 */
import {
  GanttCellData,
  GanttCellComment,
  GanttCellFile,
  GanttCellLink,
} from './gantt-cell-data.entity';

describe('GanttCellData', () => {
  describe('constructor', () => {
    it('should create a GanttCellData with all properties', () => {
      const cellData = new GanttCellData('2024-01-01', 'phase-1', true, '#FF0000');

      expect(cellData.date).toBe('2024-01-01');
      expect(cellData.phaseId).toBe('phase-1');
      expect(cellData.isMilestone).toBe(true);
      expect(cellData.milestoneColor).toBe('#FF0000');
      expect(cellData.comments).toEqual([]);
      expect(cellData.files).toEqual([]);
      expect(cellData.links).toEqual([]);
    });

    it('should create a GanttCellData with minimal properties', () => {
      const cellData = new GanttCellData('2024-01-01');

      expect(cellData.date).toBe('2024-01-01');
      expect(cellData.phaseId).toBeUndefined();
      expect(cellData.isMilestone).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should pass validation with valid date', () => {
      expect(() => {
        new GanttCellData('2024-01-01');
      }).not.toThrow();
    });

    it('should throw error when date format is invalid', () => {
      expect(() => {
        new GanttCellData('invalid-date');
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });

    it('should throw error when date is empty', () => {
      expect(() => {
        new GanttCellData('');
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });

    it('should throw error when date is whitespace only', () => {
      expect(() => {
        new GanttCellData('   ');
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });

    it('should throw error when date format is invalid (wrong format)', () => {
      expect(() => {
        new GanttCellData('01-01-2024');
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });

    it('should throw error when date is invalid (invalid month)', () => {
      expect(() => {
        new GanttCellData('2024-13-01');
      }).toThrow('Valid date in YYYY-MM-DD format is required');
    });
  });
});

describe('GanttCellComment', () => {
  describe('constructor', () => {
    it('should create a GanttCellComment with all properties', () => {
      const comment = new GanttCellComment('Comment text', 'Author Name');

      expect(comment.text).toBe('Comment text');
      expect(comment.author).toBe('Author Name');
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new GanttCellComment('Valid comment', 'Author');
      }).not.toThrow();
    });

    it('should throw error when text is empty', () => {
      expect(() => {
        new GanttCellComment('', 'Author');
      }).toThrow('Comment text is required');
    });

    it('should throw error when author is empty', () => {
      expect(() => {
        new GanttCellComment('Text', '');
      }).toThrow('Comment author is required');
    });
  });
});

describe('GanttCellFile', () => {
  describe('constructor', () => {
    it('should create a GanttCellFile with all properties', () => {
      const file = new GanttCellFile('file.pdf', 'https://example.com/file.pdf', 1024, 'application/pdf');

      expect(file.name).toBe('file.pdf');
      expect(file.url).toBe('https://example.com/file.pdf');
      expect(file.size).toBe(1024);
      expect(file.mimeType).toBe('application/pdf');
    });

    it('should create a GanttCellFile without optional properties', () => {
      const file = new GanttCellFile('file.pdf', 'https://example.com/file.pdf');

      expect(file.size).toBeUndefined();
      expect(file.mimeType).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new GanttCellFile('file.pdf', 'https://example.com/file.pdf');
      }).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new GanttCellFile('', 'https://example.com/file.pdf');
      }).toThrow('File name is required');
    });

    it('should throw error when url is empty', () => {
      expect(() => {
        new GanttCellFile('file.pdf', '');
      }).toThrow('File URL is required');
    });
  });
});

describe('GanttCellLink', () => {
  describe('constructor', () => {
    it('should create a GanttCellLink with all properties', () => {
      const link = new GanttCellLink('Link Title', 'https://example.com', 'Description');

      expect(link.title).toBe('Link Title');
      expect(link.url).toBe('https://example.com');
      expect(link.description).toBe('Description');
    });

    it('should create a GanttCellLink without description', () => {
      const link = new GanttCellLink('Link Title', 'https://example.com');

      expect(link.description).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should pass validation with valid data', () => {
      expect(() => {
        new GanttCellLink('Valid Link', 'https://example.com');
      }).not.toThrow();
    });

    it('should throw error when title is empty', () => {
      expect(() => {
        new GanttCellLink('', 'https://example.com');
      }).toThrow('Link title is required');
    });

    it('should throw error when url is empty', () => {
      expect(() => {
        new GanttCellLink('Title', '');
      }).toThrow('Link URL is required');
    });
  });
});

