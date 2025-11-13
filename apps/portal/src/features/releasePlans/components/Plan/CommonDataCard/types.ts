/**
 * Common Data Card Types
 *
 * Type definitions for products, components, and features
 */

export interface ComponentVersion {
  id: string;
  name: string;
  type: string; // 'web', 'mobile', 'service', 'dashboard', 'gateway', etc.
  version?: string;
  description?: string;
  status?: "development" | "testing" | "production" | "deprecated";
  lastUpdated?: string;
}

export interface FeatureVersion {
  id: string;
  name: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "critical";
  status?: "backlog" | "in-progress" | "testing" | "completed" | "blocked";
  assignedTeam?: string;
  category?: string; // 'ui', 'backend', 'integration', 'security', etc.
  estimatedHours?: number;
  lastUpdated?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  components: ComponentVersion[];
  features: FeatureVersion[];
}

export interface CommonDataCardProps {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
  selectedProduct?: string;
  products?: Product[];
  onProductChange?: (productId: string) => void;
}
