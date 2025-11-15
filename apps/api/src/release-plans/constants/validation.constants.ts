/**
 * Release Plans Module Validation Constants
 * 
 * Constants specific to the Release Plans module for validation messages
 */

import { FIELD_VALIDATION_MESSAGES } from '../../common/constants';

/**
 * Release Plans Module Field Validation Messages
 */
export const PLAN_VALIDATION_MESSAGES = {
  PLAN_NAME_REQUIRED: FIELD_VALIDATION_MESSAGES.PLAN_NAME_REQUIRED,
  PLAN_OWNER_REQUIRED: FIELD_VALIDATION_MESSAGES.PLAN_OWNER_REQUIRED,
  PLAN_START_DATE_REQUIRED: FIELD_VALIDATION_MESSAGES.PLAN_START_DATE_REQUIRED,
  PLAN_END_DATE_REQUIRED: FIELD_VALIDATION_MESSAGES.PLAN_END_DATE_REQUIRED,
} as const;

