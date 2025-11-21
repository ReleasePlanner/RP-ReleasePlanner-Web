import { Box, Typography } from "@mui/material";
import { STATUS_LABELS } from "../../../../../../feature/constants";
import type { FeatureStatus } from "../../../../../../feature/types";

export type FeaturesEmptyStateProps = {
  readonly searchQuery: string;
  readonly statusFilter: FeatureStatus | "all";
};

export function FeaturesEmptyState({
  searchQuery,
  statusFilter,
}: FeaturesEmptyStateProps) {
  const getMessage = () => {
    if (searchQuery) {
      return "No features found matching the search.";
    }
    if (statusFilter === "all") {
      return "No features available to add.";
    }
    return `No features with status ${STATUS_LABELS[statusFilter]}.`;
  };

  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.6875rem" }}>
        {getMessage()}
      </Typography>
    </Box>
  );
}

