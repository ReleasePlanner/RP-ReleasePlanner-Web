/**
 * Product Maintenance constants and configurations
 */

import {
  Web as WebIcon,
  CloudQueue as ServicesIcon,
  PhoneAndroid as MobileIcon,
} from "@mui/icons-material";
import {
  ComponentType,
  type ComponentTypeValue,
  type ComponentTypeDisplay,
} from "./types";

/**
 * Component type configurations for display
 */
export const COMPONENT_TYPE_CONFIG: Record<
  ComponentTypeValue,
  ComponentTypeDisplay
> = {
  [ComponentType.WEB]: {
    label: "Web Application",
    color: "primary",
    icon: WebIcon,
  },
  [ComponentType.SERVICES]: {
    label: "Backend Services",
    color: "info",
    icon: ServicesIcon,
  },
  [ComponentType.MOBILE]: {
    label: "Mobile Application",
    color: "secondary",
    icon: MobileIcon,
  },
};

/**
 * Component type labels
 */
export const COMPONENT_TYPE_LABELS: Record<ComponentTypeValue, string> = {
  [ComponentType.WEB]: "Web",
  [ComponentType.SERVICES]: "Services",
  [ComponentType.MOBILE]: "Mobile",
};

/**
 * Column definitions for product table
 */
export const PRODUCT_TABLE_COLUMNS = {
  ID: "id",
  NAME: "name",
  COMPONENTS: "components",
  ACTIONS: "actions",
} as const;

/**
 * Empty product template
 */
export const EMPTY_PRODUCT = {
  id: "",
  name: "",
  components: [],
} as const;

/**
 * Empty component template
 */
export const EMPTY_COMPONENT: {
  id: string;
  type: ComponentTypeValue;
  currentVersion: string;
  previousVersion: string;
} = {
  id: "",
  type: ComponentType.WEB,
  currentVersion: "",
  previousVersion: "",
};
