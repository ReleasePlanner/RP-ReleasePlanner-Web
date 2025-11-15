/**
 * Component Types Module Validation Constants
 * 
 * Constants specific to the Component Types module for validation messages
 */

import { FIELD_VALIDATION_MESSAGES } from '../../common/constants';

/**
 * Component Types Module Field Validation Messages
 */
export const COMPONENT_TYPE_VALIDATION_MESSAGES = {
  COMPONENT_TYPE_NAME_REQUIRED: FIELD_VALIDATION_MESSAGES.COMPONENT_TYPE_NAME_REQUIRED || 'Component type name is required',
} as const;

