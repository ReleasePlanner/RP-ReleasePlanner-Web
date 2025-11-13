/**
 * Request Context Interceptor
 * 
 * Adds correlation ID and request context to all requests for better tracing
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
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestContextInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Generate correlation ID if not present
    const correlationId = request.headers['x-correlation-id'] || uuidv4();
    request.correlationId = correlationId;
    response.setHeader('X-Correlation-ID', correlationId);

    // Add request ID for internal tracking
    const requestId = uuidv4();
    request.requestId = requestId;

    // Add user context if available (from auth middleware)
    if (request.user) {
      request.userContext = {
        userId: request.user.id || request.user.sub,
        username: request.user.username || request.user.email,
      };
    }

    return next.handle().pipe(
      tap(() => {
        // Log successful request with context
        this.logger.debug(
          `Request completed: ${request.method} ${request.url}`,
          {
            correlationId,
            requestId,
            method: request.method,
            url: request.url,
            statusCode: response.statusCode,
          },
        );
      }),
    );
  }
}

