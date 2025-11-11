import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import {
  LocalPlanStatus,
  LOCAL_PLAN_STATUS_LABELS,
  LOCAL_PLAN_STATUS_COLORS,
} from "@/constants";
import type { PlanStatus } from "../../../types";

export interface StatusSelectorProps {
  status: PlanStatus;
  onStatusChange?: (status: PlanStatus) => void;
  disabled?: boolean;
}

// Icon mapping for each status
const STATUS_ICONS: Record<string, React.ReactElement> = {
  [LocalPlanStatus.PENDING]: <ScheduleIcon />,
  [LocalPlanStatus.PLANNING]: <CircleIcon />,
  [LocalPlanStatus.IN_PROGRESS]: <PlayArrowIcon />,
  [LocalPlanStatus.ON_HOLD]: <PauseIcon />,
  [LocalPlanStatus.CANCELED]: <CancelIcon />,
  [LocalPlanStatus.CLOSED]: <CheckCircleIcon />,
};

/**
 * Status selector component with visual feedback
 * - Displays current status as a chip
 * - Allows selection from dropdown
 * - Shows icons for each status
 * - Color-coded by status type
 */
export function StatusSelector({
  status,
  onStatusChange,
  disabled = false,
}: StatusSelectorProps) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as PlanStatus;
    onStatusChange?.(newStatus);
  };

  // Get color for status
  const getStatusColor = (statusValue: string) => {
    const colorKey = LOCAL_PLAN_STATUS_COLORS[
      statusValue as keyof typeof LOCAL_PLAN_STATUS_COLORS
    ] as "default" | "primary" | "success" | "warning" | "error" | "info";

    if (colorKey === "default") {
      return theme.palette.grey[500];
    }
    return theme.palette[colorKey].main;
  };

  return (
    <FormControl size="small" disabled={disabled}>
      <Select
        value={status}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          const colorKey =
            LOCAL_PLAN_STATUS_COLORS[
              selected as keyof typeof LOCAL_PLAN_STATUS_COLORS
            ];

          return (
            <Chip
              icon={STATUS_ICONS[selected]}
              label={
                LOCAL_PLAN_STATUS_LABELS[
                  selected as keyof typeof LOCAL_PLAN_STATUS_LABELS
                ]
              }
              size="small"
              color={
                colorKey === "default" || colorKey === "info"
                  ? "primary"
                  : colorKey
              }
              sx={{
                height: 26,
                minWidth: 140,
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.3px",
                cursor: "pointer",
                px: 2,
                "& .MuiChip-icon": {
                  fontSize: 16,
                },
                boxShadow: () => {
                  const color = getStatusColor(selected);
                  return `0 1px 3px ${alpha(color, 0.3)}`;
                },
              }}
            />
          );
        }}
        sx={{
          minWidth: 140,
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiSelect-select": {
            py: 0.5,
            px: 0,
            display: "flex",
            alignItems: "center",
          },
          "&:hover": {
            "& .MuiChip-root": {
              transform: "scale(1.02)",
            },
          },
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              "& .MuiList-root": {
                py: 1,
              },
            },
          },
        }}
      >
        {Object.values(LocalPlanStatus).map((value) => {
          const color = getStatusColor(value);
          const label =
            LOCAL_PLAN_STATUS_LABELS[
              value as keyof typeof LOCAL_PLAN_STATUS_LABELS
            ];

          return (
            <MenuItem
              key={value}
              value={value}
              sx={{
                py: 1.25,
                px: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderRadius: 1,
                mx: 0.5,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: alpha(color, 0.1),
                  transform: "translateX(4px)",
                },
                "&.Mui-selected": {
                  bgcolor: alpha(color, 0.15),
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: alpha(color, 0.2),
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: alpha(color, 0.1),
                  color: color,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {STATUS_ICONS[value]}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: status === value ? 600 : 500,
                    fontSize: "0.875rem",
                    letterSpacing: "0.01em",
                    color: theme.palette.text.primary,
                  }}
                >
                  {label}
                </Typography>

                {/* Status description */}
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.6875rem",
                    color: theme.palette.text.secondary,
                    display: "block",
                    mt: 0.25,
                  }}
                >
                  {getStatusDescription(value)}
                </Typography>
              </Box>

              {/* Visual indicator for selected item */}
              {status === value && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: color,
                    boxShadow: `0 0 0 2px ${alpha(color, 0.2)}`,
                  }}
                />
              )}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

// Helper function to provide descriptions for each status
function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    [LocalPlanStatus.PENDING]: "Awaiting approval or start",
    [LocalPlanStatus.PLANNING]: "Currently being planned",
    [LocalPlanStatus.IN_PROGRESS]: "Active development",
    [LocalPlanStatus.ON_HOLD]: "Temporarily paused",
    [LocalPlanStatus.CANCELED]: "Will not be completed",
    [LocalPlanStatus.CLOSED]: "Successfully completed",
  };
  return descriptions[status] || "";
}
