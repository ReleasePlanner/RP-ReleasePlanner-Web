/**
 * Feature Management Types
 *
 * Defines interfaces for features, categories, and product owners
 */

/**
 * Product Owner information
 */
export interface ProductOwner {
  id: string;
  name: string;
}

/**
 * Feature Category
 */
export interface FeatureCategory {
  id: string;
  name: string;
}

/**
 * Feature Status enumeration
 */
export type FeatureStatus = "planned" | "in-progress" | "completed" | "on-hold";

/**
 * Individual feature within a product
 */
export interface Feature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  createdBy: ProductOwner;
  technicalDescription: string;
  businessDescription: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Product with its features
 */
export interface ProductWithFeatures {
  id: string;
  name: string;
  features: Feature[];
}
