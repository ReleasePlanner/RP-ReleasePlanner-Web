/**
 * Component Configuration Builder
 *
 * Factory function to build ComponentConfig objects based on component characteristics.
 * Centralizes the logic for determining component properties (icon type, color, description)
 * based on component name patterns.
 *
 * @module builders/componentConfigBuilder
 */

import React from "react";
import {
  Web as WebIcon,
  PhoneAndroid as MobileIcon,
  Cloud as ServiceIcon,
  Dashboard as PortalIcon,
  Api as ApiIcon,
  Storage as DatabaseIcon,
} from "@mui/icons-material";

export interface ComponentConfig {
  name: string;
  icon: React.ReactElement;
  color: "primary" | "secondary" | "success" | "info" | "warning";
  description: string;
}

/**
 * Type for component type configuration (without JSX icon)
 */
interface ComponentTypeConfig {
  keywords: readonly string[];
  iconComponent: React.ComponentType;
  color: "primary" | "secondary" | "success" | "info" | "warning";
  description: string;
}

/**
 * Mapping of component type keywords to their configurations
 * Icons are stored as component references to avoid JSX in constants
 */
const COMPONENT_TYPE_MAP: Record<string, ComponentTypeConfig> = {
  web: {
    keywords: ["web", "portal"],
    iconComponent: WebIcon,
    color: "primary",
    description: "Frontend web application or portal",
  },
  mobile: {
    keywords: ["mobile", "app"],
    iconComponent: MobileIcon,
    color: "secondary",
    description: "Mobile application",
  },
  service: {
    keywords: ["service", "api"],
    iconComponent: ServiceIcon,
    color: "success",
    description: "Backend service or API",
  },
  dashboard: {
    keywords: ["dashboard"],
    iconComponent: PortalIcon,
    color: "info",
    description: "Dashboard or analytics interface",
  },
  gateway: {
    keywords: ["gateway"],
    iconComponent: ApiIcon,
    color: "warning",
    description: "API Gateway or routing service",
  },
};

/**
 * Default component configuration fallback
 */
const DEFAULT_COMPONENT_CONFIG: ComponentTypeConfig = {
  keywords: [],
  iconComponent: DatabaseIcon,
  color: "primary",
  description: "System component",
};

/**
 * Helper function to render icon component
 */
function renderIcon(IconComponent: React.ComponentType): React.ReactElement {
  return React.createElement(IconComponent);
}

/**
 * Builder function to create ComponentConfig from component name
 *
 * @param componentName - The name of the component
 * @returns ComponentConfig object with icon, color, and description
 *
 * @example
 * const webConfig = buildComponentConfig("User Portal");
 * const mobileConfig = buildComponentConfig("Mobile App");
 */
export function buildComponentConfig(componentName: string): ComponentConfig {
  const normalizedName = componentName.toLowerCase();

  // Search through type map to find matching configuration
  for (const [, config] of Object.entries(COMPONENT_TYPE_MAP)) {
    if (config.keywords.some((keyword) => normalizedName.includes(keyword))) {
      return {
        name: componentName,
        icon: renderIcon(config.iconComponent),
        color: config.color,
        description: config.description,
      };
    }
  }

  // Return default configuration if no match found
  return {
    name: componentName,
    icon: renderIcon(DEFAULT_COMPONENT_CONFIG.iconComponent),
    color: DEFAULT_COMPONENT_CONFIG.color,
    description: DEFAULT_COMPONENT_CONFIG.description,
  };
}

/**
 * Get all available component types and their configurations
 * Useful for generating lists or documentation
 */
export function getAvailableComponentTypes(): Record<
  string,
  {
    keywords: readonly string[];
    color: "primary" | "secondary" | "success" | "info" | "warning";
    description: string;
  }
> {
  const result: Record<
    string,
    {
      keywords: readonly string[];
      color: "primary" | "secondary" | "success" | "info" | "warning";
      description: string;
    }
  > = {};

  for (const [type, config] of Object.entries(COMPONENT_TYPE_MAP)) {
    result[type] = {
      keywords: config.keywords,
      color: config.color,
      description: config.description,
    };
  }

  return result;
}
