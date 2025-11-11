import {
  Typography,
  IconButton,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  useTheme,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  CalendarMonth,
  AccessTime,
} from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import {
  LOCAL_PLAN_STATUS_LABELS,
  LOCAL_PLAN_STATUS_COLORS,
} from "@/constants";
import type { PlanStatus } from "../../../types";
import { useAppSelector } from "@/store/hooks";

export type PlanHeaderProps = {
  id: string;
  name: string;
  status: PlanStatus;
  startDate: string;
  endDate: string;
  productId?: string;
  itOwner?: string;
  description?: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onProductChange?: (productId: string) => void;
  onITOwnerChange?: (itOwnerId: string) => void;
};

/**
 * Header component for PlanCard
 * Displays plan name, status, dates, duration, product and IT owner selectors
 */
export function PlanHeader({
  id,
  name,
  status,
  startDate,
  endDate,
  productId,
  itOwner,
  description,
  expanded,
  onToggleExpanded,
  onProductChange,
  onITOwnerChange,
}: PlanHeaderProps) {
  const theme = useTheme();

  // Get products and IT owners from Redux store
  const products = useAppSelector((state) => state.products.products);
  const itOwners = useAppSelector((state) => state.itOwners.itOwners);

  // Calculate duration in days
  const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffTime = Math.abs(endTime - startTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration(startDate, endDate);

  // Format date range
  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      {/* First Row: ID, Name, Status, Expand Button */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        {/* Plan ID */}
        <Chip
          label={`ID: ${id}`}
          size="small"
          variant="outlined"
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 500,
            borderColor: alpha(theme.palette.divider, 0.3),
            color: theme.palette.text.secondary,
          }}
        />

        {/* Plan Name */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: 1.3,
            color: theme.palette.text.primary,
            minWidth: 0,
            flex: 1,
          }}
        >
          {name}
        </Typography>

        {/* Status Chip */}
        <Chip
          label={LOCAL_PLAN_STATUS_LABELS[status]}
          size="small"
          color={LOCAL_PLAN_STATUS_COLORS[status]}
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 500,
          }}
        />

        {/* Expand/Collapse Button */}
        <IconButton
          onClick={onToggleExpanded}
          aria-label={expanded ? "Collapse plan" : "Expand plan"}
          size="small"
          sx={{
            color: theme.palette.action.active,
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Second Row: Date Range and Duration */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}
      >
        {/* Date Range */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <CalendarMonth
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: theme.palette.text.secondary,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8125rem",
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {formatDateRange(startDate, endDate)}
          </Typography>
        </Box>

        {/* Duration */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <AccessTime
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: theme.palette.text.secondary,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8125rem",
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {duration} days
          </Typography>
        </Box>
      </Box>

      {/* Third Row: Product and IT Owner Selectors */}
      <Box
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
      >
        {/* Product Selector */}
        <FormControl
          size="small"
          sx={{
            minWidth: 200,
            flex: { xs: "1 1 100%", sm: "1 1 auto" },
          }}
        >
          <InputLabel id={`product-select-label-${id}`}>Product</InputLabel>
          <Select
            labelId={`product-select-label-${id}`}
            id={`product-select-${id}`}
            value={productId || ""}
            label="Product"
            onChange={(e: SelectChangeEvent) => {
              if (onProductChange) {
                onProductChange(e.target.value);
              }
            }}
            sx={{
              fontSize: "0.875rem",
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* IT Owner Selector */}
        <FormControl
          size="small"
          sx={{
            minWidth: 200,
            flex: { xs: "1 1 100%", sm: "1 1 auto" },
          }}
        >
          <InputLabel id={`it-owner-select-label-${id}`}>IT Owner</InputLabel>
          <Select
            labelId={`it-owner-select-label-${id}`}
            id={`it-owner-select-${id}`}
            value={itOwner || ""}
            label="IT Owner"
            onChange={(e: SelectChangeEvent) => {
              if (onITOwnerChange) {
                onITOwnerChange(e.target.value);
              }
            }}
            sx={{
              fontSize: "0.875rem",
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {itOwners.map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Description (if provided) */}
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.875rem",
            lineHeight: 1.4,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
