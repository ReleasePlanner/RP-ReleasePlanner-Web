/**
 * Component types and categories
 */

export const ComponentType = {
  WEB: "web",
  MOBILE: "mobile",
  SERVICE: "service",
  LIBRARY: "library",
  DATABASE: "database",
  INFRASTRUCTURE: "infrastructure",
} as const;

export type ComponentTypeValue =
  (typeof ComponentType)[keyof typeof ComponentType];

export const ComponentCategory = {
  UI: "ui",
  BACKEND: "backend",
  INTEGRATION: "integration",
  SECURITY: "security",
  INFRASTRUCTURE: "infrastructure",
  DEVOPS: "devops",
  DATA: "data",
  TESTING: "testing",
} as const;

export type ComponentCategoryValue =
  (typeof ComponentCategory)[keyof typeof ComponentCategory];

export const COMPONENT_TYPE_LABELS: Record<ComponentTypeValue, string> = {
  [ComponentType.WEB]: "Web Application",
  [ComponentType.MOBILE]: "Mobile App",
  [ComponentType.SERVICE]: "Service",
  [ComponentType.LIBRARY]: "Library",
  [ComponentType.DATABASE]: "Database",
  [ComponentType.INFRASTRUCTURE]: "Infrastructure",
};

export const COMPONENT_CATEGORY_LABELS: Record<ComponentCategoryValue, string> =
  {
    [ComponentCategory.UI]: "User Interface",
    [ComponentCategory.BACKEND]: "Backend",
    [ComponentCategory.INTEGRATION]: "Integration",
    [ComponentCategory.SECURITY]: "Security",
    [ComponentCategory.INFRASTRUCTURE]: "Infrastructure",
    [ComponentCategory.DEVOPS]: "DevOps",
    [ComponentCategory.DATA]: "Data",
    [ComponentCategory.TESTING]: "Testing",
  };
