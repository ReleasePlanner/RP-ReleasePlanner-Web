/**
 * HTTP Exception Filter Unit Tests
 * Coverage: 100%
 */
import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { BusinessException, NotFoundException, ConflictException } from '../exceptions/business-exception';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockRequest = {
      url: '/api/test',
      method: 'GET',
    };
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;
  });

  describe('catch', () => {
    it('should handle HttpException', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle BusinessException', () => {
      const exception = new BusinessException('Business error', HttpStatus.BAD_REQUEST, 'BUSINESS_ERROR');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle NotFoundException', () => {
      const exception = new NotFoundException('Entity', 'id-1');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle ConflictException', () => {
      const exception = new ConflictException('Conflict error', 'CONFLICT_CODE');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle generic Error', () => {
      const exception = new Error('Generic error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle HttpException with string response', () => {
      const exception = new HttpException('String error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException({ message: 'Object error' }, HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should include request details in error response', () => {
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockArgumentsHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('path', '/api/test');
      expect(jsonCall).toHaveProperty('method', 'GET');
      expect(jsonCall).toHaveProperty('timestamp');
    });
  });
});

