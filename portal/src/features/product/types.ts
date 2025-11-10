/**
 * Product Maintenance types and interfaces
 *
 * Defines the data structures for products and their components
 */

import type { ReactNode } from "react";

/**
 * Component type constants
 */
export const ComponentType = {
  WEB: "web",
  SERVICES: "services",
  MOBILE: "mobile",
} as const;

export type ComponentTypeValue =
  (typeof ComponentType)[keyof typeof ComponentType];

/**
 * Component version information
 */
export interface ComponentVersion {
  id: string;
  type: ComponentTypeValue;
  currentVersion: string;
  previousVersion: string;
}

/**
 * Product structure
 */
export interface Product {
  id: string;
  name: string;
  components: ComponentVersion[];
}

/**
 * Component type display information
 */
export interface ComponentTypeDisplay {
  label: string;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  icon: React.ComponentType | ReactNode;
}
