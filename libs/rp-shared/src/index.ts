/**
 * RpShared Library
 *
 * Shared utilities and validators for Release Planner monorepo
 *
 * Usage:
 * - In NestJS (API): Import from '@rp-release-planner/rp-shared' - uses NestJS adapters automatically
 * - In React/React Native: Import from '@rp-release-planner/rp-shared' - uses core validators
 */

// Export ValidationError and utility functions from core validators
export {
  ValidationError,
  safeTrim,
  isNotEmpty,
} from './validators/defensive-validators.js';

// Export NestJS adapters (these wrap core validators with BadRequestException)
// In NestJS context, these will be used; in other contexts, users can import core validators directly
export {
  validateString,
  validateId,
  validateObject,
  validateArray,
  validateNumber,
  validateDateString,
  validatePassword,
  validateEmailFormat,
  validateRange,
} from './validators/nestjs-adapters.js';

