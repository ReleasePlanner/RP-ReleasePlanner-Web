/**
 * Logging Interceptor
 * 
 * Logs all HTTP requests and responses with structured logging
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip, headers } = request;
    const correlationId = request.correlationId || 'unknown';
    const requestId = request.requestId || 'unknown';
    const userAgent = headers['user-agent'] || 'unknown';
    const now = Date.now();

    // Log request start
    this.logger.log(
      JSON.stringify({
        type: 'request_start',
        method,
        url,
        correlationId,
        requestId,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      }),
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - now;
          const { statusCode } = response;

          // Log successful response
          this.logger.log(
            JSON.stringify({
              type: 'request_success',
              method,
              url,
              statusCode,
              duration,
              correlationId,
              requestId,
              timestamp: new Date().toISOString(),
            }),
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          const statusCode = response.statusCode || 500;

          // Log error response
          this.logger.error(
            JSON.stringify({
              type: 'request_error',
              method,
              url,
              statusCode,
              duration,
              correlationId,
              requestId,
              error: {
                message: error.message,
                name: error.name,
                code: error.code,
              },
              timestamp: new Date().toISOString(),
            }),
            error.stack,
          );
        },
      }),
    );
  }
}

