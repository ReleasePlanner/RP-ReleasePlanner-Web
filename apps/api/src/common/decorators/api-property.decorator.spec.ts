/**
 * ApiProperty Decorator Unit Tests
 * Coverage: 100%
 */
import {
  ApiPropertyId,
  ApiPropertyName,
  ApiPropertyDate,
  ApiPropertyDateTime,
  ApiPropertyOptionalString,
} from './api-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

// Mock ApiProperty
jest.mock('@nestjs/swagger', () => ({
  ApiProperty: jest.fn((options) => options),
}));

describe('ApiProperty Decorators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ApiPropertyId', () => {
    it('should create ApiProperty with ID description', () => {
      const result = ApiPropertyId();

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'ID único del recurso',
        example: 'resource-123',
      });
      expect(result).toBeDefined();
    });

    it('should merge custom options', () => {
      const customOptions = {
        type: String,
        required: true,
      };

      ApiPropertyId(customOptions);

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'ID único del recurso',
        example: 'resource-123',
        type: String,
        required: true,
      });
    });

    it('should override default options', () => {
      const customOptions = {
        example: 'custom-id',
        description: 'Custom description',
      };

      ApiPropertyId(customOptions);

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Custom description',
        example: 'custom-id',
      });
    });
  });

  describe('ApiPropertyName', () => {
    it('should create ApiProperty with name description', () => {
      ApiPropertyName();

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Nombre del recurso',
        example: 'Nombre del recurso',
        minLength: 1,
      });
    });

    it('should merge custom options', () => {
      const customOptions = {
        maxLength: 100,
      };

      ApiPropertyName(customOptions);

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Nombre del recurso',
        example: 'Nombre del recurso',
        minLength: 1,
        maxLength: 100,
      });
    });
  });

  describe('ApiPropertyDate', () => {
    it('should create ApiProperty with date description', () => {
      ApiPropertyDate();

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Fecha en formato ISO (YYYY-MM-DD)',
        example: '2024-01-01',
        type: String,
      });
    });

    it('should merge custom options', () => {
      const customOptions = {
        format: 'date',
      };

      ApiPropertyDate(customOptions);

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Fecha en formato ISO (YYYY-MM-DD)',
        example: '2024-01-01',
        type: String,
        format: 'date',
      });
    });
  });

  describe('ApiPropertyDateTime', () => {
    it('should create ApiProperty with datetime description', () => {
      ApiPropertyDateTime();

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Fecha y hora en formato ISO',
        example: '2024-01-01T00:00:00.000Z',
        type: Date,
      });
    });

    it('should merge custom options', () => {
      const customOptions = {
        format: 'date-time',
      };

      ApiPropertyDateTime(customOptions);

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Fecha y hora en formato ISO',
        example: '2024-01-01T00:00:00.000Z',
        type: Date,
        format: 'date-time',
      });
    });
  });

  describe('ApiPropertyOptionalString', () => {
    it('should create ApiProperty with optional string', () => {
      ApiPropertyOptionalString('Test description');

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Test description',
        example: undefined,
        required: false,
        type: String,
      });
    });

    it('should include example when provided', () => {
      ApiPropertyOptionalString('Test description', 'example-value');

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: 'Test description',
        example: 'example-value',
        required: false,
        type: String,
      });
    });

    it('should handle empty description', () => {
      ApiPropertyOptionalString('', 'example');

      expect(require('@nestjs/swagger').ApiProperty).toHaveBeenCalledWith({
        description: '',
        example: 'example',
        required: false,
        type: String,
      });
    });
  });
});

