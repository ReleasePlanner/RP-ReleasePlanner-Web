/**
 * Product data and utilities for Release Planner
 *
 * This file contains initial product data and utility functions
 * for managing products and their components.
 *
 * Products are managed through the Product Maintenance page and stored in Redux.
 * This file provides initial mock data for testing and development.
 */

import type {
  Product,
  ComponentVersion,
  FeatureVersion,
} from "@/features/releasePlans/components/Plan/CommonDataCard/types";

// Mock products data for default initialization
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Release Planner Suite",
    description: "Complete release planning and management platform",
    components: [
      {
        id: "comp-1",
        name: "Web Application",
        type: "web",
        version: "2.1.4",
        description: "Main web interface for release planning",
        status: "production",
        lastUpdated: "2025-01-15",
      },
      {
        id: "comp-2",
        name: "API Service",
        type: "service",
        version: "3.0.1",
        description: "Core backend API for all operations",
        status: "production",
        lastUpdated: "2025-01-20",
      },
      {
        id: "comp-3",
        name: "Mobile App",
        type: "mobile",
        version: "1.5.2",
        description: "iOS and Android mobile application",
        status: "production",
        lastUpdated: "2025-01-18",
      },
      {
        id: "comp-4",
        name: "Database Service",
        type: "service",
        version: "2.8.0",
        description: "PostgreSQL database with replication",
        status: "production",
        lastUpdated: "2025-01-22",
      },
    ],
    features: [],
  },
  {
    id: "prod-2",
    name: "Analytics Platform",
    description: "Business intelligence and reporting solution",
    components: [
      {
        id: "comp-5",
        name: "Web Dashboard",
        type: "dashboard",
        version: "4.2.1",
        description: "Interactive analytics and visualization interface",
        status: "production",
        lastUpdated: "2025-01-25",
      },
      {
        id: "comp-6",
        name: "Data Processing Engine",
        type: "service",
        version: "3.5.0",
        description: "ETL pipeline for data transformation",
        status: "production",
        lastUpdated: "2025-01-20",
      },
      {
        id: "comp-7",
        name: "Report Generator",
        type: "service",
        version: "2.1.0",
        description: "Automated report generation service",
        status: "production",
        lastUpdated: "2025-01-15",
      },
    ],
    features: [],
  },
  {
    id: "prod-3",
    name: "Customer Portal",
    description: "Self-service portal for customer management",
    components: [
      {
        id: "comp-8",
        name: "Customer Portal Web",
        type: "web",
        version: "1.3.0",
        description: "Customer-facing web application",
        status: "production",
        lastUpdated: "2025-01-10",
      },
      {
        id: "comp-9",
        name: "Payment Gateway Integration",
        type: "service",
        version: "1.0.5",
        description: "Stripe and PayPal payment integrations",
        status: "production",
        lastUpdated: "2025-01-12",
      },
    ],
    features: [],
  },
];

/**
 * Gets a product by its ID
 */
export function getProductById(productId: string): Product | undefined {
  return SAMPLE_PRODUCTS.find((product) => product.id === productId);
}

/**
 * Gets components for a specific product
 */
export function getProductComponents(productId: string): ComponentVersion[] {
  const product = getProductById(productId);
  return product ? product.components : [];
}

/**
 * Gets features for a specific product
 */
export function getProductFeatures(productId: string): FeatureVersion[] {
  const product = getProductById(productId);
  return product ? product.features : [];
}

/**
 * Gets all available products
 */
export function getAllProducts(): Product[] {
  return SAMPLE_PRODUCTS;
}

/**
 * Searches products by name (case-insensitive)
 */
export function searchProductsByName(searchTerm: string): Product[] {
  if (!searchTerm.trim()) {
    return SAMPLE_PRODUCTS;
  }

  const lowercaseSearch = searchTerm.toLowerCase();
  return SAMPLE_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseSearch) ||
      (product.description &&
        product.description.toLowerCase().includes(lowercaseSearch))
  );
}

/**
 * Gets products that have a specific component
 */
export function getProductsByComponent(componentName: string): Product[] {
  return SAMPLE_PRODUCTS.filter((product) =>
    product.components.some(
      (component: ComponentVersion) =>
        component.name.toLowerCase().includes(componentName.toLowerCase()) ||
        component.type.toLowerCase().includes(componentName.toLowerCase())
    )
  );
}

export default {
  SAMPLE_PRODUCTS,
  getProductById,
  getProductComponents,
  getProductFeatures,
  getAllProducts,
  searchProductsByName,
  getProductsByComponent,
};
