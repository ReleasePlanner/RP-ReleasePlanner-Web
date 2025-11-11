import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CalendarMonth,
  Check,
  Close,
  Edit,
  ArrowForward,
} from "@mui/icons-material";

export interface DateRangeEditorProps {
  startDate: string;
  endDate: string;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  disabled?: boolean;
}

/**
 * Editable date range component with validation
 * - Shows start and end dates clearly
 * - Allows inline editing
 * - Validates that end date >= start date
 * - Visual feedback for validation errors
 */
export function DateRangeEditor({
  startDate,
  endDate,
  onDateRangeChange,
  disabled = false,
}: DateRangeEditorProps) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [validationError, setValidationError] = useState<string>("");

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Validate date range
  const validateDateRange = (start: string, end: string): boolean => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (isNaN(startTime) || isNaN(endTime)) {
      setValidationError("Invalid date format");
      return false;
    }

    if (endTime < startTime) {
      setValidationError("End date must be after or equal to start date");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleEdit = () => {
    if (disabled) return;
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setValidationError("");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (validateDateRange(tempStartDate, tempEndDate)) {
      onDateRangeChange?.(tempStartDate, tempEndDate);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setValidationError("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
        }}
      >
        {/* Edit Mode Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          <CalendarMonth
            sx={{
              fontSize: 18,
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              letterSpacing: "0.02em",
            }}
          >
            Edit Period
          </Typography>
        </Box>

        {/* Date Inputs */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* Start Date */}
          <Box sx={{ flex: "1 1 180px", minWidth: 180 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.5,
                fontWeight: 600,
                color: theme.palette.success.main,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontSize: "0.6875rem",
              }}
            >
              🟢 Start Date
            </Typography>
            <TextField
              type="date"
              value={tempStartDate}
              onChange={(e) => {
                setTempStartDate(e.target.value);
                validateDateRange(e.target.value, tempEndDate);
              }}
              fullWidth
              size="small"
              error={!!validationError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha(theme.palette.success.main, 0.04),
                  borderRadius: 1.5,
                  fontWeight: 500,
                  "&.Mui-focused": {
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                  },
                },
              }}
              InputProps={{
                sx: {
                  fontSize: "0.875rem",
                },
              }}
            />
          </Box>

          {/* Arrow */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pt: 3,
            }}
          >
            <ArrowForward
              sx={{
                fontSize: 20,
                color: theme.palette.text.secondary,
              }}
            />
          </Box>

          {/* End Date */}
          <Box sx={{ flex: "1 1 180px", minWidth: 180 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.5,
                fontWeight: 600,
                color: theme.palette.error.main,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontSize: "0.6875rem",
              }}
            >
              🔴 End Date
            </Typography>
            <TextField
              type="date"
              value={tempEndDate}
              onChange={(e) => {
                setTempEndDate(e.target.value);
                validateDateRange(tempStartDate, e.target.value);
              }}
              fullWidth
              size="small"
              error={!!validationError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha(theme.palette.error.main, 0.04),
                  borderRadius: 1.5,
                  fontWeight: 500,
                  "&.Mui-focused": {
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                  },
                },
              }}
              InputProps={{
                sx: {
                  fontSize: "0.875rem",
                },
              }}
            />
          </Box>
        </Box>

        {/* Validation Error */}
        {validationError && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.error.main,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
            }}
          >
            ⚠️ {validationError}
          </Typography>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
          }}
        >
          <Tooltip title="Cancel">
            <IconButton
              onClick={handleCancel}
              size="small"
              sx={{
                color: theme.palette.error.main,
                bgcolor: alpha(theme.palette.error.main, 0.08),
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, 0.15),
                  transform: "scale(1.05)",
                },
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton
              onClick={handleSave}
              size="small"
              disabled={!!validationError}
              sx={{
                color: theme.palette.success.main,
                bgcolor: alpha(theme.palette.success.main, 0.08),
                "&:hover": {
                  bgcolor: alpha(theme.palette.success.main, 0.15),
                  transform: "scale(1.05)",
                },
                "&.Mui-disabled": {
                  opacity: 0.5,
                },
              }}
            >
              <Check sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }

  // Display Mode
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1,
        borderRadius: 1.5,
        bgcolor: alpha(theme.palette.secondary.main, 0.06),
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: alpha(theme.palette.secondary.main, 0.1),
          borderColor: alpha(theme.palette.secondary.main, 0.25),
          boxShadow: `0 2px 6px ${alpha(theme.palette.secondary.main, 0.15)}`,
        },
      }}
    >
      <CalendarMonth
        sx={{
          fontSize: { xs: 18, sm: 20 },
          color: theme.palette.secondary.main,
        }}
      />

      {/* Start Date with Label */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.25,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.625rem",
            fontWeight: 700,
            color: alpha(theme.palette.success.dark, 0.8),
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Start
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: theme.palette.text.primary,
            lineHeight: 1.2,
          }}
        >
          {formatDate(startDate)}
        </Typography>
      </Box>

      {/* Arrow Separator */}
      <ArrowForward
        sx={{
          fontSize: 16,
          color: theme.palette.text.secondary,
          mx: 0.5,
        }}
      />

      {/* End Date with Label */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.25,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.625rem",
            fontWeight: 700,
            color: alpha(theme.palette.error.dark, 0.8),
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          End
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: theme.palette.text.primary,
            lineHeight: 1.2,
          }}
        >
          {formatDate(endDate)}
        </Typography>
      </Box>

      {/* Edit Button */}
      {!disabled && (
        <Tooltip title="Edit dates">
          <IconButton
            onClick={handleEdit}
            size="small"
            sx={{
              ml: 0.5,
              color: theme.palette.secondary.main,
              bgcolor: alpha(theme.palette.secondary.main, 0.08),
              width: 28,
              height: 28,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: alpha(theme.palette.secondary.main, 0.15),
                transform: "scale(1.1)",
              },
            }}
          >
            <Edit sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
