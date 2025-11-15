/**
 * Release Plans Module API Property Constants
 * 
 * Constants for ApiProperty descriptions and examples specific to Release Plans module
 */

import { API_PROPERTY_DESCRIPTIONS, API_PROPERTY_EXAMPLES } from '../../common/constants';

/**
 * Release Plans Module API Property Descriptions
 */
export const PLAN_API_PROPERTY_DESCRIPTIONS = {
  NAME: 'Nombre del plan',
  OWNER: 'Propietario del plan',
  START_DATE: 'Fecha de inicio del plan (YYYY-MM-DD)',
  END_DATE: 'Fecha de fin del plan (YYYY-MM-DD)',
  STATUS: 'Estado del plan',
  DESCRIPTION: 'Descripción del plan',
  PHASES_LIST: 'Lista de fases del plan',
  TASKS_LIST: 'Lista de tareas del plan',
  PRODUCT_ID: 'ID del producto asociado',
  IT_OWNER: 'ID del propietario IT',
  FEATURES_LIST: 'IDs de las features asociadas',
  CALENDARS_LIST: 'IDs de los calendarios asociados',
  COMPONENTS_LIST: 'Componentes del plan',
  PHASE_NAME: 'Nombre de la fase',
  PHASE_START_DATE: 'Fecha de inicio (YYYY-MM-DD)',
  PHASE_END_DATE: 'Fecha de fin (YYYY-MM-DD)',
  PHASE_COLOR: 'Color en formato hexadecimal',
  TASK_TITLE: 'Título de la tarea',
  TASK_START_DATE: 'Fecha de inicio (YYYY-MM-DD)',
  TASK_END_DATE: 'Fecha de fin (YYYY-MM-DD)',
  TASK_COLOR: 'Color en formato hexadecimal',
  MILESTONE_NAME: 'Nombre del milestone',
  MILESTONE_DATE: 'Fecha del milestone (YYYY-MM-DD)',
  MILESTONE_DESCRIPTION: 'Descripción del milestone',
  REFERENCE_TYPE: 'Tipo de referencia',
  REFERENCE_TITLE: 'Título de la referencia',
  REFERENCE_URL: 'URL de la referencia',
  REFERENCE_DESCRIPTION: 'Descripción de la referencia',
  REFERENCE_DATE: 'Fecha asociada (YYYY-MM-DD)',
  REFERENCE_PHASE_ID: 'ID de la fase asociada',
  COMMENT_TEXT: 'Texto del comentario',
  COMMENT_AUTHOR: 'Autor del comentario',
  FILE_NAME: 'Nombre del archivo',
  FILE_URL: 'URL del archivo',
  FILE_SIZE: 'Tamaño del archivo en bytes',
  FILE_MIME_TYPE: 'Tipo MIME del archivo',
  LINK_TITLE: 'Título del enlace',
  LINK_URL: 'URL del enlace',
  LINK_DESCRIPTION: 'Descripción del enlace',
  LINK_PHASE_ID: 'ID de la fase asociada',
  CELL_DATE: 'Fecha de la celda (YYYY-MM-DD)',
  CELL_IS_MILESTONE: 'Indica si es un milestone',
  CELL_MILESTONE_COLOR: 'Color del milestone',
  CELL_COMMENTS: 'Comentarios de la celda',
  CELL_FILES: 'Archivos de la celda',
  CELL_LINKS: 'Enlaces de la celda',
} as const;

/**
 * Release Plans Module API Property Examples
 */
export const PLAN_API_PROPERTY_EXAMPLES = {
  NAME: API_PROPERTY_EXAMPLES.NAME_PLAN,
  OWNER: API_PROPERTY_EXAMPLES.OWNER,
  START_DATE: API_PROPERTY_EXAMPLES.DATE_START,
  END_DATE: API_PROPERTY_EXAMPLES.DATE_END,
  DESCRIPTION: API_PROPERTY_EXAMPLES.DESCRIPTION_PLAN,
  PRODUCT_ID: API_PROPERTY_EXAMPLES.ID_PRODUCT,
  IT_OWNER: API_PROPERTY_EXAMPLES.ID_OWNER,
  PHASE_NAME: API_PROPERTY_EXAMPLES.NAME_PHASE,
  PHASE_START_DATE: API_PROPERTY_EXAMPLES.DATE_START,
  PHASE_END_DATE: API_PROPERTY_EXAMPLES.DATE_MID,
  PHASE_COLOR: API_PROPERTY_EXAMPLES.COLOR_HEX,
  TASK_TITLE: API_PROPERTY_EXAMPLES.TASK_TITLE,
  TASK_START_DATE: API_PROPERTY_EXAMPLES.DATE_START,
  TASK_END_DATE: API_PROPERTY_EXAMPLES.DATE_TASK_END,
  TASK_COLOR: API_PROPERTY_EXAMPLES.COLOR_HEX_ALT,
  MILESTONE_NAME: API_PROPERTY_EXAMPLES.MILESTONE_NAME,
  MILESTONE_DATE: API_PROPERTY_EXAMPLES.DATE_MILESTONE,
} as const;

