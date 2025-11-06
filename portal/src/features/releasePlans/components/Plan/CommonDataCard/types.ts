export interface CommonDataItem {
  label: string;
  value: string;
  icon: string;
}

export interface ComponentVersion {
  id: string;
  name: string;
  type: string; // 'web', 'mobile', 'service', 'api', 'dashboard', etc.
  version?: string; // Optional version control number (e.g., "1.2.3", "v2.0.0")
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
  components: ComponentVersion[]; // Enhanced components with version info
  features: FeatureVersion[]; // Project features and requirements
}

export type ViewMode = "grid" | "list";

export interface CommonDataCardProps {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
  selectedProduct?: string;
  products?: Product[];
  onProductChange?: (productId: string) => void;
}

export const COMMON_DATA_ICONS = {
  OWNER: "👤",
  START_DATE: "📅",
  END_DATE: "🏁",
  ID: "🆔",
} as const;

export const createCommonDataItems = (
  props: CommonDataCardProps
): CommonDataItem[] => [
  { label: "Owner", value: props.owner, icon: COMMON_DATA_ICONS.OWNER },
  {
    label: "Start",
    value: props.startDate,
    icon: COMMON_DATA_ICONS.START_DATE,
  },
  { label: "End", value: props.endDate, icon: COMMON_DATA_ICONS.END_DATE },
  { label: "ID", value: props.id, icon: COMMON_DATA_ICONS.ID },
];
