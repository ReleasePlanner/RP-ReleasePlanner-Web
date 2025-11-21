import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  useTheme,
  alpha,
} from "@mui/material";
import type { Feature } from "../../../../../../api/services/features.service";
import type { PlanStatus } from "../../../../types";
import { FeatureRow } from "./FeatureRow";

export type FeaturesTableProps = {
  readonly features: Feature[];
  readonly selectedIds: string[];
  readonly featureToActivePlansMap: Map<
    string,
    Array<{ id: string; name: string; status: PlanStatus }>
  >;
  readonly isAllSelected: boolean;
  readonly isSomeSelected: boolean;
  readonly onToggleFeature: (featureId: string) => void;
  readonly onSelectAll: () => void;
};

export function FeaturesTable({
  features,
  selectedIds,
  featureToActivePlansMap,
  isAllSelected,
  isSomeSelected,
  onToggleFeature,
  onSelectAll,
}: FeaturesTableProps) {
  const theme = useTheme();

  const getDisabledReason = (
    feature: Feature,
    activePlans: Array<{ id: string; name: string; status: PlanStatus }>
  ): string => {
    const isCompleted = feature.status === "completed";
    const isInActivePlan = activePlans.length > 0;

    if (!isCompleted) {
      return "Only features with Completed status can be added";
    }
    if (isInActivePlan) {
      const planNames = activePlans.map((p) => p.name).join(", ");
      return `This feature is in the active plan: ${planNames}`;
    }
    return "";
  };

  return (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              padding="checkbox"
              sx={{
                width: 50,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
              }}
            >
              <Checkbox
                id="select-all-features-checkbox"
                name="selectAllFeatures"
                indeterminate={isSomeSelected}
                checked={isAllSelected}
                onChange={onSelectAll}
                size="small"
                disabled={features.length === 0}
              />
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: "0.625rem",
                py: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
              }}
            >
              Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: "0.625rem",
                py: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
              }}
            >
              Category
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: "0.625rem",
                py: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: "0.625rem",
                py: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
              }}
            >
              Description
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((feature) => {
            const isSelected = selectedIds.includes(feature.id);
            const activePlans = featureToActivePlansMap.get(feature.id) || [];
            const isCompleted = feature.status === "completed";
            const isInActivePlan = activePlans.length > 0;
            const isDisabled = !isCompleted || isInActivePlan;
            const disabledReason = getDisabledReason(feature, activePlans);

            return (
              <FeatureRow
                key={feature.id}
                feature={feature}
                isSelected={isSelected}
                isDisabled={isDisabled}
                disabledReason={disabledReason}
                activePlans={activePlans}
                onToggle={onToggleFeature}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

