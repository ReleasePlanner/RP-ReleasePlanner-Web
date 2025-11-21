import { useMemo, useState } from "react";
import { processFeatures } from "../../../../../../feature/utils/featureUtils";
import type { SortBy } from "../../../../../../feature/components/FeatureToolbar";
import type { FeatureStatus } from "../../../../../../feature/types";
import type { Feature } from "../../../../../../api/services/features.service";
import type { PlanStatus } from "../../../../types";

export function useSelectFeaturesFilters(
  allAvailableFeatures: Feature[],
  featureToActivePlansMap: Map<
    string,
    Array<{ id: string; name: string; status: PlanStatus }>
  >
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | "all">(
    "all"
  );

  // Filter by status - show all features when filtering, but only completed can be selected
  const filteredFeatures = useMemo(() => {
    if (statusFilter === "all") {
      // By default, show only completed features
      return allAvailableFeatures.filter((f) => f.status === "completed");
    }
    // When a specific status filter is selected, show those features (but they'll be disabled if not completed)
    return allAvailableFeatures.filter((f) => f.status === statusFilter);
  }, [allAvailableFeatures, statusFilter]);

  // Process features: filter and sort
  const processedFeatures = useMemo(() => {
    return processFeatures(filteredFeatures, searchQuery, sortBy);
  }, [filteredFeatures, searchQuery, sortBy]);

  // Only count completed features that are not in active plans for selection
  const selectableFeatures = useMemo(() => {
    return processedFeatures.filter((f) => {
      if (f.status !== "completed") return false;
      const activePlans = featureToActivePlansMap.get(f.id);
      return !activePlans || activePlans.length === 0;
    });
  }, [processedFeatures, featureToActivePlansMap]);

  // Count features by status for filter chips
  const statusCounts = useMemo(() => {
    const counts: Record<FeatureStatus | "all", number> = {
      all: selectableFeatures.length,
      planned: allAvailableFeatures.filter((f) => f.status === "planned")
        .length,
      "in-progress": allAvailableFeatures.filter(
        (f) => f.status === "in-progress"
      ).length,
      completed: selectableFeatures.length,
      "on-hold": allAvailableFeatures.filter((f) => f.status === "on-hold")
        .length,
    };
    return counts;
  }, [selectableFeatures, allAvailableFeatures]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    processedFeatures,
    selectableFeatures,
    statusCounts,
  };
}

