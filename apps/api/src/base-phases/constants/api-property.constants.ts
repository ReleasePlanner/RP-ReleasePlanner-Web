/**
 * Base Phases Module API Property Constants
 * 
 * Constants for ApiProperty descriptions and examples specific to Base Phases module
 */

import { API_PROPERTY_DESCRIPTIONS, API_PROPERTY_EXAMPLES } from '../../common/constants';

/**
 * Base Phases Module API Property Descriptions
 */
export const BASE_PHASE_API_PROPERTY_DESCRIPTIONS = {
  NAME: 'Nombre de la fase base',
  COLOR: 'Color de la fase en formato hexadecimal',
  ID: 'ID único de la fase base',
  CREATED_AT: 'Fecha de creación',
  UPDATED_AT: 'Fecha de última actualización',
} as const;

/**
 * Base Phases Module API Property Examples
 */
export const BASE_PHASE_API_PROPERTY_EXAMPLES = {
  NAME: API_PROPERTY_EXAMPLES.NAME_PHASE,
  COLOR: API_PROPERTY_EXAMPLES.COLOR_HEX,
  ID: API_PROPERTY_EXAMPLES.ID_BASE,
  DATETIME: API_PROPERTY_EXAMPLES.DATETIME,
} as const;

