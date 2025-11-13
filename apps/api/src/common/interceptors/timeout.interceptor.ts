/**
 * Timeout Interceptor
 * 
 * Enforces request timeout to prevent hanging requests
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimeoutInterceptor.name);
  private readonly defaultTimeout: number;

  constructor(timeoutMs: number = 30000) {
    // Default 30 seconds, can be configured via environment variable
    this.defaultTimeout = parseInt(
      process.env.REQUEST_TIMEOUT_MS || String(timeoutMs),
      10,
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      timeout(this.defaultTimeout),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          this.logger.warn(
            `Request timeout: ${method} ${url} (exceeded ${this.defaultTimeout}ms)`,
          );
          return throwError(
            () => new RequestTimeoutException(
              `Request timeout: The operation took longer than ${this.defaultTimeout}ms to complete`,
            ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}

