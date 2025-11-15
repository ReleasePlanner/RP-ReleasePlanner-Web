/**
 * Products Module API Property Constants
 * 
 * Constants for ApiProperty descriptions and examples specific to Products module
 */

import { API_PROPERTY_DESCRIPTIONS, API_PROPERTY_EXAMPLES } from '../../common/constants';

/**
 * Products Module API Property Descriptions
 */
export const PRODUCT_API_PROPERTY_DESCRIPTIONS = {
  NAME: 'Nombre del producto',
  COMPONENTS_LIST: 'Lista de componentes del producto',
  COMPONENT_ID: 'ID del componente',
  COMPONENT_TYPE: 'Tipo de componente',
  CURRENT_VERSION: 'Versión actual',
  PREVIOUS_VERSION: 'Versión anterior',
  CREATED_AT: 'Fecha de creación',
  UPDATED_AT: 'Fecha de actualización',
} as const;

/**
 * Products Module API Property Examples
 */
export const PRODUCT_API_PROPERTY_EXAMPLES = {
  NAME: API_PROPERTY_EXAMPLES.NAME_PRODUCT,
  ID: API_PROPERTY_EXAMPLES.ID_PRODUCT,
  COMPONENT_ID: API_PROPERTY_EXAMPLES.ID_COMPONENT,
  COMPONENT_TYPE: API_PROPERTY_EXAMPLES.COMPONENT_TYPE_WEB,
  CURRENT_VERSION: API_PROPERTY_EXAMPLES.VERSION_CURRENT,
  PREVIOUS_VERSION: API_PROPERTY_EXAMPLES.VERSION_PREVIOUS,
} as const;

