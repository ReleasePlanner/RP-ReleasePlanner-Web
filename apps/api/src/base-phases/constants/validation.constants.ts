/**
 * Base Phases Module Validation Constants
 * 
 * Constants specific to the Base Phases module for validation messages
 */

import { FIELD_VALIDATION_MESSAGES } from '../../common/constants';

/**
 * Base Phases Module Field Validation Messages
 */
export const BASE_PHASE_VALIDATION_MESSAGES = {
  PHASE_NAME_REQUIRED: FIELD_VALIDATION_MESSAGES.PHASE_NAME_REQUIRED,
  PHASE_COLOR_REQUIRED: FIELD_VALIDATION_MESSAGES.PHASE_COLOR_REQUIRED,
  PHASE_COLOR_INVALID: FIELD_VALIDATION_MESSAGES.PHASE_COLOR_INVALID,
} as const;

