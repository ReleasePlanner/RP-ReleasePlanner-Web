/**
 * Retry Decorator
 * 
 * Implements retry logic for methods that may fail
 */
import { Logger } from '@nestjs/common';

const logger = new Logger('Retry');

export function Retry(
  maxAttempts = 3,
  delay = 1000,
  backoff = 2,
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error | undefined;
      let currentDelay = delay;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await method.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          logger.warn(
            `Attempt ${attempt}/${maxAttempts} failed for ${propertyName}: ${(error as Error).message}`,
          );

          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, currentDelay));
            currentDelay *= backoff;
          }
        }
      }

      if (!lastError) {
        const error = new Error(`All ${maxAttempts} attempts failed for ${propertyName}`);
        logger.error(
          `All ${maxAttempts} attempts failed for ${propertyName}`,
          error.stack,
        );
        throw error;
      }
      
      logger.error(
        `All ${maxAttempts} attempts failed for ${propertyName}`,
        lastError.stack,
      );
      throw lastError;
    };
  };
}

