import {
  TextField,
  Box,
  Typography,
  useTheme,
  alpha,
  Stack,
  InputAdornment,
  Alert,
  Grid,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
  CalendarToday as CalendarIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { utcToLocalDate, localDateToUTC, getCurrentDateUTC, addDays } from "../../../lib/date";
import { PHASE_COLORS } from "../../../lib/colors";
import type { PlanPhase } from "../../../types";
import { BaseEditDialog } from "@/components/BaseEditDialog";

export type PhaseEditDialogProps = {
  open: boolean;
  phase: PlanPhase | null;
  planPhases?: PlanPhase[]; // All phases in the current plan
  onCancel: () => void;
  onSave: (phase: PlanPhase) => void;
};

export default function PhaseEditDialog({
  open,
  phase,
  planPhases = [],
  onCancel,
  onSave,
}: PhaseEditDialogProps) {
  const theme = useTheme();
  const basePhases = useAppSelector((state) => state.basePhases.phases);
  const isNew = !phase?.id || phase.id.startsWith("new-");

  // Check if phase is a base phase (from maintenance)
  const isBasePhase = useMemo(() => {
    if (!phase) return false;
    // Check if phase name and color match any base phase
    return basePhases.some(
      (bp) => bp.name === phase.name && bp.color === phase.color
    );
  }, [phase, basePhases]);

  const [formData, setFormData] = useState<{
    name: string;
    startDate: string;
    endDate: string;
    color: string;
  }>({
    name: "",
    startDate: "",
    endDate: "",
    color: "#185ABD",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    startDate?: string;
    endDate?: string;
    dateRange?: string;
    color?: string;
  }>({});

  const [isValidating, setIsValidating] = useState(false);

  // Initialize form when dialog opens
  useEffect(() => {
    if (open && phase) {
      // Default dates: today and 7 days later
      const todayUTC = getCurrentDateUTC();
      const weekLaterDate = addDays(
        new Date(Date.UTC(
          parseInt(todayUTC.split("-")[0]),
          parseInt(todayUTC.split("-")[1]) - 1,
          parseInt(todayUTC.split("-")[2])
        )),
        7
      );
      const weekLaterUTC = weekLaterDate.toISOString().slice(0, 10);

      // Ensure we have valid dates - use defaults if missing
      const startDate = phase.startDate ? utcToLocalDate(phase.startDate) : utcToLocalDate(todayUTC);
      const endDate = phase.endDate ? utcToLocalDate(phase.endDate) : utcToLocalDate(weekLaterUTC);
      
      // Validate that dates are valid strings
      if (!startDate || !endDate) {
        console.warn('[PhaseEditDialog] Invalid dates in phase, using defaults:', {
          phaseId: phase.id,
          phaseName: phase.name,
          originalStartDate: phase.startDate,
          originalEndDate: phase.endDate,
          computedStartDate: startDate,
          computedEndDate: endDate,
        });
      }

      setFormData({
        name: phase.name || "",
        startDate: startDate || utcToLocalDate(todayUTC),
        endDate: endDate || utcToLocalDate(weekLaterUTC),
        color: phase.color || "#185ABD",
      });
      setErrors({});
      setIsValidating(false);
    } else if (open && !phase) {
      // New phase - set defaults
      const todayUTC = getCurrentDateUTC();
      const weekLaterDate = addDays(
        new Date(Date.UTC(
          parseInt(todayUTC.split("-")[0]),
          parseInt(todayUTC.split("-")[1]) - 1,
          parseInt(todayUTC.split("-")[2])
        )),
        7
      );
      const weekLaterUTC = weekLaterDate.toISOString().slice(0, 10);

      setFormData({
        name: "",
        startDate: utcToLocalDate(todayUTC),
        endDate: utcToLocalDate(weekLaterUTC),
        color: "#185ABD",
      });
      setErrors({});
      setIsValidating(false);
    }
  }, [open, phase]);

  // Get all used colors (base phases + plan phases, excluding current phase)
  const getUsedColors = useCallback((): string[] => {
    const baseColors = basePhases.map((p) => p.color);
    const planColors = planPhases
      .filter((p) => p.id !== phase?.id) // Exclude current phase
      .map((p) => p.color);
    return [...baseColors, ...planColors];
  }, [basePhases, planPhases, phase?.id]);

  // Validate phase name uniqueness
  const validatePhaseName = useCallback(
    (name: string): boolean => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setErrors((prev) => ({
          ...prev,
          name: "Phase name is required",
        }));
        return false;
      }

      // Check uniqueness against other phases in the plan (excluding current phase)
      const existingPhaseNames = planPhases
        .filter((p) => p.id !== phase?.id)
        .map((n) => n.name.toLowerCase().trim());
      const normalizedNew = trimmedName.toLowerCase().trim();

      if (existingPhaseNames.includes(normalizedNew)) {
        setErrors((prev) => ({
          ...prev,
          name: "A phase with this name already exists in the plan",
        }));
        return false;
      }

      setErrors((prev) => ({ ...prev, name: undefined }));
      return true;
    },
    [planPhases, phase?.id]
  );

  // Validate color uniqueness
  const validateColor = useCallback(
    (color: string): boolean => {
      const usedColors = getUsedColors();
      if (usedColors.includes(color)) {
        setErrors((prev) => ({
          ...prev,
          color: "This color is already in use. Please select a different color.",
        }));
        return false;
      }
      setErrors((prev) => ({ ...prev, color: undefined }));
      return true;
    },
    [getUsedColors]
  );

  // Validate dates
  const validateDates = useCallback((): boolean => {
    const dateErrors: {
      startDate?: string;
      endDate?: string;
      dateRange?: string;
    } = {};

    // Validate start date
    if (!formData.startDate || formData.startDate.trim() === "") {
      dateErrors.startDate = "Start date is required";
    }

    // Validate end date
    if (!formData.endDate || formData.endDate.trim() === "") {
      dateErrors.endDate = "End date is required";
    }

    // Validate date range (only if both dates are present)
    // Compare dates as strings (YYYY-MM-DD format) - ISO date strings are lexicographically sortable
    if (formData.startDate && formData.endDate && formData.startDate.trim() !== "" && formData.endDate.trim() !== "") {
      if (formData.endDate < formData.startDate) {
        dateErrors.dateRange = "End date must be after or equal to start date";
      }
    }

    // Update errors state, clearing date-related errors that are not present in dateErrors
    setErrors((prev) => {
      const newErrors = { ...prev };
      // Clear date errors if they're not in dateErrors
      if (!dateErrors.startDate) {
        delete newErrors.startDate;
      } else {
        newErrors.startDate = dateErrors.startDate;
      }
      
      if (!dateErrors.endDate) {
        delete newErrors.endDate;
      } else {
        newErrors.endDate = dateErrors.endDate;
      }
      
      if (!dateErrors.dateRange) {
        delete newErrors.dateRange;
      } else {
        newErrors.dateRange = dateErrors.dateRange;
      }
      
      return newErrors;
    });
    
    return Object.keys(dateErrors).length === 0;
  }, [formData.startDate, formData.endDate]);

  // Validate on name change with debounce
  useEffect(() => {
    if (!open) return;

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setErrors((prev) => ({ ...prev, name: undefined }));
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      validatePhaseName(trimmedName);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData.name, open, validatePhaseName]);

  // Validate color on change
  useEffect(() => {
    if (!open || !formData.color) return;
    validateColor(formData.color);
  }, [formData.color, open, validateColor]);

  // Validate dates on change (but not on initial load)
  useEffect(() => {
    if (!open) return;
    // Only validate if both dates have been touched (not empty strings)
    // This prevents showing errors when dialog first opens with valid dates
    if (formData.startDate || formData.endDate) {
      validateDates();
    }
  }, [formData.startDate, formData.endDate, open, validateDates]);

  const handleSave = useCallback(() => {
    // For base phases, only validate dates
    if (isBasePhase) {
      if (!validateDates()) return;
      
      // Ensure we have valid dates before saving
      if (!formData.startDate || !formData.endDate) {
        setErrors((prev) => ({
          ...prev,
          startDate: !formData.startDate ? "Start date is required" : prev.startDate,
          endDate: !formData.endDate ? "End date is required" : prev.endDate,
        }));
        return;
      }
    } else {
      // For local phases, validate all fields
      if (!validatePhaseName(formData.name.trim())) return;
      if (!validateColor(formData.color)) return;
      if (!validateDates()) return;
      
      // Ensure we have all required fields before saving
      if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
        setErrors((prev) => ({
          ...prev,
          name: !formData.name.trim() ? "Phase name is required" : prev.name,
          startDate: !formData.startDate ? "Start date is required" : prev.startDate,
          endDate: !formData.endDate ? "End date is required" : prev.endDate,
        }));
        return;
      }
    }

    // Convert dates to UTC before saving
    const startDateUTC = formData.startDate ? localDateToUTC(formData.startDate) : "";
    const endDateUTC = formData.endDate ? localDateToUTC(formData.endDate) : "";
    
    // Final validation: ensure UTC dates are valid
    if (!startDateUTC || !endDateUTC) {
      console.error('[PhaseEditDialog] Invalid dates after UTC conversion:', {
        startDate: formData.startDate,
        endDate: formData.endDate,
        startDateUTC,
        endDateUTC,
      });
      setErrors((prev) => ({
        ...prev,
        startDate: !startDateUTC ? "Invalid start date" : prev.startDate,
        endDate: !endDateUTC ? "Invalid end date" : prev.endDate,
      }));
      return;
    }

    const savedPhase: PlanPhase = {
      id: phase?.id || `phase-${Date.now()}`,
      name: isBasePhase ? (phase?.name || "") : formData.name.trim(), // Keep original name for base phases
      startDate: startDateUTC,
      endDate: endDateUTC,
      color: isBasePhase ? (phase?.color || "#185ABD") : formData.color, // Keep original color for base phases
    };

    // Final validation: ensure saved phase has all required fields
    if (!savedPhase.name || !savedPhase.startDate || !savedPhase.endDate) {
      console.error('[PhaseEditDialog] Saved phase is missing required fields:', {
        phase: savedPhase,
        hasName: !!savedPhase.name,
        hasStartDate: !!savedPhase.startDate,
        hasEndDate: !!savedPhase.endDate,
      });
      setErrors((prev) => ({
        ...prev,
        name: !savedPhase.name ? "Phase name is required" : prev.name,
        startDate: !savedPhase.startDate ? "Start date is required" : prev.startDate,
        endDate: !savedPhase.endDate ? "End date is required" : prev.endDate,
      }));
      return;
    }

    onSave(savedPhase);
    onCancel();
  }, [formData, phase, isBasePhase, validatePhaseName, validateColor, validateDates, onSave, onCancel]);

  const isFormValid = useMemo(() => {
    // Check for date-related errors
    const hasDateErrors = !!(errors.startDate || errors.endDate || errors.dateRange);
    
    if (isBasePhase) {
      // For base phases, only validate dates
      return (
        formData.startDate !== "" &&
        formData.endDate !== "" &&
        !hasDateErrors
      );
    } else {
      // For local phases, validate all fields
      const hasOtherErrors = !!(errors.name || errors.color);
      return (
        formData.name.trim() !== "" &&
        formData.startDate !== "" &&
        formData.endDate !== "" &&
        !hasDateErrors &&
        !hasOtherErrors &&
        !isValidating
      );
    }
  }, [formData, errors, isValidating, isBasePhase]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFormValid) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <BaseEditDialog
      open={open}
      onClose={onCancel}
      editing={!isNew}
      title={isNew ? "New Phase" : "Edit Phase"}
      subtitle={isBasePhase
        ? "Standard maintenance phase - You can only edit dates"
        : "Modify phase details"}
      subtitleChip={isBasePhase ? "Base Phase" : undefined}
      maxWidth="sm"
      fullWidth={true}
      onSave={handleSave}
      saveButtonText="Save Changes"
      cancelButtonText="Cancel"
      isFormValid={isFormValid}
      saveButtonDisabled={!isFormValid}
      showDefaultActions={true}
    >
      <Box sx={{ pt: 1, width: "100%" }}>
        <Stack spacing={3} sx={{ width: "100%" }}>
          {/* Phase Name Input - Only for non-base phases */}
          {!isBasePhase && (
            <TextField
              autoFocus
              fullWidth
              size="small"
              label="Phase Name"
              placeholder="e.g., Planning, Development, Testing..."
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              error={!!errors.name}
              InputLabelProps={{
                sx: {
                  fontSize: "0.625rem",
                  fontWeight: 500,
                },
              }}
              helperText={
                errors.name ? (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.625rem",
                    }}
                  >
                    <ErrorIcon sx={{ fontSize: 12 }} />
                    {errors.name}
                  </Box>
                ) : isValidating ? (
                  "Validating..."
                ) : formData.name.trim() ? (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.625rem",
                      color: theme.palette.success.main,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 12 }} />
                    Name available
                  </Box>
                ) : (
                  "Enter a unique name for the phase"
                )
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.6875rem",
                },
                "& input": {
                  py: 0.625,
                  fontSize: "0.6875rem",
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "0.625rem",
                  mt: 0.5,
                },
              }}
            />
          )}

          {/* Display phase name for base phases (read-only) */}
          {isBasePhase && (
            <TextField
              fullWidth
              size="small"
              label="Phase Name"
              value={phase?.name || ""}
              disabled
              InputLabelProps={{
                sx: {
                  fontSize: "0.625rem",
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.6875rem",
                  backgroundColor: alpha(theme.palette.action.hover, 0.3),
                },
                "& input": {
                  py: 0.625,
                  fontSize: "0.6875rem",
                },
              }}
            />
          )}

          {/* Date Range */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                size="small"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                onKeyDown={handleKeyDown}
                error={!!errors.startDate || !!errors.dateRange}
                helperText={errors.startDate || undefined}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.625rem",
                    fontWeight: 500,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.6875rem",
                  },
                  "& input": {
                    py: 0.625,
                    fontSize: "0.6875rem",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "0.625rem",
                    mt: 0.5,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                onKeyDown={handleKeyDown}
                error={!!errors.endDate || !!errors.dateRange}
                helperText={errors.endDate || errors.dateRange || undefined}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.625rem",
                    fontWeight: 500,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.6875rem",
                  },
                  "& input": {
                    py: 0.625,
                    fontSize: "0.6875rem",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "0.625rem",
                    mt: 0.5,
                  },
                }}
              />
            </Grid>
          </Grid>
          {errors.dateRange && (
            <Alert
              severity="error"
              icon={<ErrorIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: 1.5,
                "& .MuiAlert-message": {
                  fontSize: "0.6875rem",
                },
                py: 0.75,
              }}
            >
              {errors.dateRange}
            </Alert>
          )}

          {/* Color Picker - Only for non-base phases */}
          {!isBasePhase && (
            <Box>
              <TextField
                label="Phase Color"
                type="color"
                fullWidth
                size="small"
                value={formData.color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                error={!!errors.color}
                helperText={errors.color || "Color must be unique and different from base phases and other plan phases"}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.625rem",
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: formData.color,
                          border: `2px solid ${errors.color ? theme.palette.error.main : alpha(theme.palette.divider, 0.2)}`,
                          flexShrink: 0,
                          boxShadow: theme.shadows[1],
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { padding: 0, height: 40, borderRadius: 4 },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.6875rem",
                  },
                  "& input": {
                    py: 0.625,
                    fontSize: "0.6875rem",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "0.625rem",
                    mt: 0.5,
                  },
                }}
              />
              {errors.color && (
                <Alert
                  severity="error"
                  icon={<ErrorIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    mt: 1,
                    borderRadius: 1.5,
                    "& .MuiAlert-message": {
                      fontSize: "0.6875rem",
                    },
                    py: 0.75,
                  }}
                >
                  {errors.color}
                </Alert>
              )}
            </Box>
          )}

          {/* Display color for base phases (read-only) */}
          {isBasePhase && (
            <TextField
              fullWidth
              size="small"
              label="Phase Color"
              value={phase?.color || "#185ABD"}
              disabled
              InputLabelProps={{
                sx: {
                  fontSize: "0.625rem",
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        bgcolor: phase?.color || "#185ABD",
                        border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                        flexShrink: 0,
                        boxShadow: theme.shadows[1],
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <LockIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.6875rem",
                  backgroundColor: alpha(theme.palette.action.hover, 0.3),
                },
                "& input": {
                  py: 0.625,
                  fontSize: "0.6875rem",
                },
              }}
            />
          )}
        </Stack>
      </Box>
    </BaseEditDialog>
  );
}
