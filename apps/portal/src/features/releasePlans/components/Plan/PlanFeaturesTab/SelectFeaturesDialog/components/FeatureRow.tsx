import { TableRow, TableCell, Checkbox, Tooltip, Typography, Chip, useTheme, alpha } from "@mui/material";
import { STATUS_LABELS, STATUS_COLORS } from "../../../../../../feature/constants";
import type { Feature } from "../../../../../../api/services/features.service";
import type { PlanStatus } from "../../../../types";

export type FeatureRowProps = {
  readonly feature: Feature;
  readonly isSelected: boolean;
  readonly isDisabled: boolean;
  readonly disabledReason: string;
  readonly activePlans: Array<{ id: string; name: string; status: PlanStatus }>;
  readonly onToggle: (featureId: string) => void;
};

export function FeatureRow({
  feature,
  isSelected,
  isDisabled,
  disabledReason,
  onToggle,
}: FeatureRowProps) {
  const theme = useTheme();

  return (
    <TableRow
      hover={!isDisabled}
      onClick={() => !isDisabled && onToggle(feature.id)}
      sx={{
        cursor: isDisabled ? "not-allowed" : "pointer",
        backgroundColor: isSelected
          ? alpha(theme.palette.primary.main, 0.08)
          : isDisabled
          ? alpha(theme.palette.action.disabled, 0.03)
          : "transparent",
        opacity: isDisabled ? 0.5 : 1,
        "&:hover": {
          backgroundColor: !isDisabled
            ? isSelected
              ? alpha(theme.palette.primary.main, 0.12)
              : alpha(theme.palette.action.hover, 0.04)
            : "transparent",
        },
      }}
    >
      <TableCell padding="checkbox">
        <Tooltip
          title={disabledReason || ""}
          arrow
          disableHoverListener={!isDisabled}
        >
          <span>
            <Checkbox
              id={`feature-checkbox-${feature.id}`}
              name={`feature-${feature.id}`}
              checked={isSelected}
              onChange={() => onToggle(feature.id)}
              onClick={(e) => e.stopPropagation()}
              size="small"
              disabled={isDisabled}
            />
          </span>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ py: 1 }}>
        <Tooltip
          title={
            isDisabled && disabledReason
              ? `${feature.name} - ${disabledReason}`
              : feature.name
          }
          arrow
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: isSelected ? 600 : 400,
              fontSize: "0.6875rem",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {feature.name}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ py: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.6875rem" }}
        >
          {feature.category.name}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1 }}>
        <Chip
          label={STATUS_LABELS[feature.status]}
          size="small"
          color={STATUS_COLORS[feature.status]}
          variant="outlined"
          sx={{
            fontSize: "0.625rem",
            height: 18,
            "& .MuiChip-label": {
              px: 0.75,
            },
          }}
        />
      </TableCell>
      <TableCell sx={{ py: 1 }}>
        <Tooltip title={feature.description || "-"} arrow>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.6875rem",
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {feature.description || "-"}
          </Typography>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

