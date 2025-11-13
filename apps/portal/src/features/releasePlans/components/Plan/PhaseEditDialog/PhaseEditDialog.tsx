import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  useTheme,
  alpha,
  Stack,
  InputAdornment,
  Alert,
  Fade,
  Grid,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
  CalendarToday as CalendarIcon,
  Palette as PaletteIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { utcToLocalDate, localDateToUTC, getCurrentDateUTC, addDays } from "../../../lib/date";
import { PHASE_COLORS } from "../../../lib/colors";
import type { PlanPhase } from "../../../types";

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

      setFormData({
        name: phase.name || "",
        startDate: phase.startDate ? utcToLocalDate(phase.startDate) : utcToLocalDate(todayUTC),
        endDate: phase.endDate ? utcToLocalDate(phase.endDate) : utcToLocalDate(weekLaterUTC),
        color: phase.color || "#185ABD",
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
          name: "El nombre de la fase es requerido",
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
          name: "Ya existe una fase con este nombre en el plan",
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
          color: "Este color ya está en uso. Selecciona un color diferente.",
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
      dateErrors.startDate = "La fecha de inicio es requerida";
    }

    // Validate end date
    if (!formData.endDate || formData.endDate.trim() === "") {
      dateErrors.endDate = "La fecha de fin es requerida";
    }

    // Validate date range (only if both dates are present)
    if (formData.startDate && formData.endDate && formData.startDate.trim() !== "" && formData.endDate.trim() !== "") {
      if (formData.endDate < formData.startDate) {
        dateErrors.dateRange = "La fecha de fin debe ser posterior o igual a la fecha de inicio";
      }
    }

    // Update errors state, clearing date-related errors that are not present in dateErrors
    setErrors((prev) => ({
      ...prev,
      startDate: dateErrors.startDate,
      endDate: dateErrors.endDate,
      dateRange: dateErrors.dateRange,
    }));
    
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
    } else {
      // For local phases, validate all fields
      if (!validatePhaseName(formData.name.trim())) return;
      if (!validateColor(formData.color)) return;
      if (!validateDates()) return;
    }

    const savedPhase: PlanPhase = {
      id: phase?.id || `phase-${Date.now()}`,
      name: isBasePhase ? phase?.name || "" : formData.name.trim(), // Keep original name for base phases
      startDate: formData.startDate ? localDateToUTC(formData.startDate) : "",
      endDate: formData.endDate ? localDateToUTC(formData.endDate) : "",
      color: isBasePhase ? phase?.color || "#185ABD" : formData.color, // Keep original color for base phases
    };

    onSave(savedPhase);
    onCancel();
  }, [formData, phase, isBasePhase, validatePhaseName, validateColor, validateDates, onSave, onCancel]);

  const isFormValid = useMemo(() => {
    if (isBasePhase) {
      // For base phases, only validate dates
      return (
        formData.startDate !== "" &&
        formData.endDate !== "" &&
        !errors.startDate &&
        !errors.endDate &&
        !errors.dateRange
      );
    } else {
      // For local phases, validate all fields
      return (
        formData.name.trim() !== "" &&
        formData.startDate !== "" &&
        formData.endDate !== "" &&
        Object.keys(errors).length === 0 &&
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
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`
              : `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        },
      }}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 200 }}
    >
      <DialogTitle
        sx={{
          py: 2,
          px: 2.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
            }}
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.125rem",
                letterSpacing: "-0.01em",
                color: theme.palette.text.primary,
                mb: 0.25,
              }}
            >
              Editar Fase
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8125rem",
                color: theme.palette.text.secondary,
                fontWeight: 400,
              }}
            >
              {isBasePhase
                ? "Fase del mantenimiento estándar - Solo puedes editar las fechas"
                : "Modifica los detalles de la fase"}
            </Typography>
          </Box>
          {isBasePhase && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
              }}
            >
              <LockIcon sx={{ fontSize: 14 }} />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                Fase Base
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 2, px: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Phase Name Input - Only for non-base phases */}
          {!isBasePhase && (
            <Box>
              <TextField
                autoFocus
                fullWidth
                size="small"
                label="Nombre de la Fase"
                placeholder="Ej: Planning, Development, Testing..."
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                onKeyDown={handleKeyDown}
                error={!!errors.name}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    fontSize: "0.875rem",
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
                        fontSize: "0.75rem",
                      }}
                    >
                      <ErrorIcon sx={{ fontSize: 14 }} />
                      {errors.name}
                    </Box>
                  ) : isValidating ? (
                    "Validando..."
                  ) : formData.name.trim() ? (
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontSize: "0.75rem",
                        color: theme.palette.success.main,
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 14 }} />
                      Nombre disponible
                    </Box>
                  ) : (
                    "Ingresa un nombre único para la fase"
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimelineIcon
                        sx={{
                          fontSize: 18,
                          color: errors.name
                            ? theme.palette.error.main
                            : formData.name.trim()
                            ? theme.palette.success.main
                            : theme.palette.text.secondary,
                          transition: "color 0.2s ease",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.875rem",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: errors.name
                          ? theme.palette.error.main
                          : theme.palette.primary.main,
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 1.5,
                        borderColor: errors.name
                          ? theme.palette.error.main
                          : theme.palette.primary.main,
                      },
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Display phase name for base phases (read-only) */}
          {isBasePhase && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                backgroundColor: alpha(theme.palette.action.hover, 0.3),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <TimelineIcon
                  sx={{
                    fontSize: 20,
                    color: theme.palette.text.secondary,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.75rem",
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      display: "block",
                      mb: 0.25,
                    }}
                  >
                    Nombre de la Fase
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {phase?.name}
                  </Typography>
                </Box>
                <LockIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.text.disabled,
                  }}
                />
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 0.5 }} />

          {/* Date Range */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                mb: 1.5,
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <CalendarIcon sx={{ fontSize: 16 }} />
              Período de Fechas
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Inicio"
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
                  helperText={errors.startDate || " "}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.875rem",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.startDate
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 1.5,
                          borderColor: errors.startDate
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Fin"
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
                  helperText={errors.endDate || errors.dateRange || " "}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.875rem",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.endDate || errors.dateRange
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 1.5,
                          borderColor: errors.endDate || errors.dateRange
                            ? theme.palette.error.main
                            : theme.palette.primary.main,
                        },
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            {errors.dateRange && (
              <Alert
                severity="error"
                icon={<ErrorIcon sx={{ fontSize: 16 }} />}
                sx={{
                  mt: 1.5,
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  py: 0.5,
                }}
              >
                {errors.dateRange}
              </Alert>
            )}
          </Box>

          {/* Color Picker - Only for non-base phases */}
          {!isBasePhase && (
            <>
              <Divider sx={{ my: 0.5 }} />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    mb: 1.5,
                    color: theme.palette.text.primary,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                  }}
                >
                  <PaletteIcon sx={{ fontSize: 16 }} />
                  Color de la Fase
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: formData.color,
                      border: `2px solid ${errors.color ? theme.palette.error.main : alpha(theme.palette.divider, 0.2)}`,
                      flexShrink: 0,
                      boxShadow: theme.shadows[1],
                    }}
                  />
                  <TextField
                    label="Seleccionar Color"
                    type="color"
                    fullWidth
                    size="small"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, color: e.target.value }))
                    }
                    error={!!errors.color}
                    helperText={errors.color || "El color debe ser único y diferente a las fases base y otras fases del plan"}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      },
                    }}
                    inputProps={{
                      style: { padding: 0, height: 36, borderRadius: 4 },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.875rem",
                        "&:hover": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: errors.color
                              ? theme.palette.error.main
                              : theme.palette.primary.main,
                          },
                        },
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 1.5,
                            borderColor: errors.color
                              ? theme.palette.error.main
                              : theme.palette.primary.main,
                          },
                        },
                      },
                    }}
                  />
                </Box>
                {errors.color && (
                  <Alert
                    severity="error"
                    icon={<ErrorIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      mt: 1.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      py: 0.5,
                    }}
                  >
                    {errors.color}
                  </Alert>
                )}
              </Box>
            </>
          )}

          {/* Display color for base phases (read-only) */}
          {isBasePhase && (
            <>
              <Divider sx={{ my: 0.5 }} />
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  backgroundColor: alpha(theme.palette.action.hover, 0.3),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PaletteIcon
                    sx={{
                      fontSize: 20,
                      color: theme.palette.text.secondary,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        display: "block",
                        mb: 0.25,
                      }}
                    >
                      Color de la Fase
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 24,
                          borderRadius: 0.75,
                          bgcolor: phase?.color || "#185ABD",
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          boxShadow: theme.shadows[1],
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.8125rem",
                          fontFamily: "monospace",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {phase?.color || "#185ABD"}
                      </Typography>
                    </Box>
                  </Box>
                  <LockIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.text.disabled,
                    }}
                  />
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          gap: 1,
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.8125rem",
            px: 2,
            py: 0.75,
            borderRadius: 1,
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: alpha(theme.palette.action.hover, 0.4),
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isFormValid}
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            px: 2.5,
            py: 0.75,
            borderRadius: 1,
            boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
