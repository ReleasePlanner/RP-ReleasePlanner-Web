/**
 * Pagination DTO Tests
 * Coverage: 100%
 */
import { PaginationDto, PaginatedResponseDto } from './pagination.dto';

describe('PaginationDto', () => {
  describe('default values', () => {
    it('should have default page and limit', () => {
      const dto = new PaginationDto();

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(10);
    });
  });

  describe('skip getter', () => {
    it('should calculate skip correctly for first page', () => {
      const dto = new PaginationDto();
      dto.page = 1;
      dto.limit = 10;

      expect(dto.skip).toBe(0);
    });

    it('should calculate skip correctly for second page', () => {
      const dto = new PaginationDto();
      dto.page = 2;
      dto.limit = 10;

      expect(dto.skip).toBe(10);
    });

    it('should use defaults when page is undefined', () => {
      const dto = new PaginationDto();
      dto.page = undefined;
      dto.limit = 20;

      expect(dto.skip).toBe(0);
    });

    it('should use defaults when limit is undefined', () => {
      const dto = new PaginationDto();
      dto.page = 3;
      dto.limit = undefined;

      expect(dto.skip).toBe(20);
    });
  });

  describe('take getter', () => {
    it('should return limit value', () => {
      const dto = new PaginationDto();
      dto.limit = 25;

      expect(dto.take).toBe(25);
    });

    it('should return default when limit is undefined', () => {
      const dto = new PaginationDto();
      dto.limit = undefined;

      expect(dto.take).toBe(10);
    });
  });
});

describe('PaginatedResponseDto', () => {
  it('should create paginated response with correct values', () => {
    const data = [1, 2, 3, 4, 5];
    const total = 25;
    const pagination = new PaginationDto();
    pagination.page = 2;
    pagination.limit = 10;

    const response = new PaginatedResponseDto(data, total, pagination);

    expect(response.data).toEqual(data);
    expect(response.total).toBe(25);
    expect(response.page).toBe(2);
    expect(response.limit).toBe(10);
    expect(response.totalPages).toBe(3);
    expect(response.hasNext).toBe(true);
    expect(response.hasPrev).toBe(true);
  });

  it('should calculate hasNext correctly', () => {
    const data = [1, 2, 3];
    const total = 30;
    const pagination = new PaginationDto();
    pagination.page = 3;
    pagination.limit = 10;

    const response = new PaginatedResponseDto(data, total, pagination);

    expect(response.hasNext).toBe(false);
    expect(response.hasPrev).toBe(true);
  });

  it('should calculate hasPrev correctly', () => {
    const data = [1, 2, 3];
    const total = 30;
    const pagination = new PaginationDto();
    pagination.page = 1;
    pagination.limit = 10;

    const response = new PaginatedResponseDto(data, total, pagination);

    expect(response.hasNext).toBe(true);
    expect(response.hasPrev).toBe(false);
  });

  it('should use default pagination values', () => {
    const data = [1, 2, 3];
    const total = 5;
    const pagination = new PaginationDto();

    const response = new PaginatedResponseDto(data, total, pagination);

    expect(response.page).toBe(1);
    expect(response.limit).toBe(10);
    expect(response.totalPages).toBe(1);
  });
});

