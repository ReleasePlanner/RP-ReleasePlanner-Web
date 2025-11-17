import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  alpha,
  Box,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Popover,
  Tooltip,
} from "@mui/material";
import {
  Link as LinkIcon,
  Description as DocumentIcon,
  Note as NoteIcon,
  Flag as MilestoneIcon,
  Palette as PaletteIcon,
  CheckCircle as CheckCircleIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { useQueries } from "@tanstack/react-query";
import { calendarsService } from "@/api/services/calendars.service";
import type { APICalendar, APICalendarDay } from "@/api/services/calendars.service";
import type { PlanReference, PlanReferenceType, PlanPhase } from "../../../types";

interface ReferenceEditDialogProps {
  open: boolean;
  reference: PlanReference | null;
  isCreating: boolean;
  onClose: () => void;
  onSave: (reference: PlanReference) => void;
  phases?: PlanPhase[]; // Phases for milestone phase selection
  startDate?: string; // Plan start date for date validation
  endDate?: string; // Plan end date for date validation
  calendarIds?: string[]; // Calendar IDs to check for holidays and special days
}

// Predefined colors for milestones
const MILESTONE_COLORS = [
  { label: "Rojo", value: "#F44336" },
  { label: "Rosa", value: "#E91E63" },
  { label: "Púrpura", value: "#9C27B0" },
  { label: "Índigo", value: "#3F51B5" },
  { label: "Azul", value: "#2196F3" },
  { label: "Cian", value: "#00BCD4" },
  { label: "Verde", value: "#4CAF50" },
  { label: "Lima", value: "#CDDC39" },
  { label: "Amarillo", value: "#FFEB3B" },
  { label: "Ámbar", value: "#FFC107" },
  { label: "Naranja", value: "#FF9800" },
  { label: "Marrón", value: "#795548" },
];

export function ReferenceEditDialog({
  open,
  reference,
  isCreating,
  onClose,
  onSave,
  phases = [],
  startDate,
  endDate,
  calendarIds = [],
}: ReferenceEditDialogProps) {
  const theme = useTheme();
  const [type, setType] = useState<PlanReferenceType>("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneColor, setMilestoneColor] = useState("#F44336");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [milestonePhaseId, setMilestonePhaseId] = useState<string>("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [urlError, setUrlError] = useState("");
  const [dateError, setDateError] = useState("");
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState("#F44336");
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLButtonElement | null>(null);

  // Load ALL calendars associated with the plan to check for holidays and special days
  // This ensures we validate against ALL calendars, not just some
  const calendarQueries = useQueries({
    queries: calendarIds.map((id) => ({
      queryKey: ['calendars', 'detail', id],
      queryFn: () => calendarsService.getById(id),
      enabled: !!id && open && type === "milestone",
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  // Get all calendar days (holidays and special days) from ALL calendars
  const calendarDays = useMemo(() => {
    const days: Array<{ date: string; name: string; type: string; calendarName: string }> = [];
    calendarQueries.forEach((query, index) => {
      if (query.isSuccess && query.data?.days) {
        const calendarName = query.data.name || `Calendario ${index + 1}`;
        query.data.days.forEach((day: APICalendarDay) => {
          days.push({
            date: day.date,
            name: day.name,
            type: day.type,
            calendarName: calendarName,
          });
        });
      }
    });
    return days;
  }, [calendarQueries]);

  // Check if a date is a weekend
  // Parse date string (YYYY-MM-DD) without timezone issues
  const isWeekend = (dateString: string): boolean => {
    if (!dateString || dateString.length !== 10) return false;
    
    // Parse YYYY-MM-DD format manually to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
    
    // Create date in UTC to avoid timezone shifts
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = date.getUTCDay();
    
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  };

  // Check if a date is a holiday or special day in ANY calendar - memoized
  const isHolidayOrSpecialDay = useCallback((dateString: string): { isHoliday: boolean; dayName?: string; calendarName?: string } => {
    const matchingDays = calendarDays.filter((d) => d.date === dateString);
    if (matchingDays.length > 0) {
      // If multiple calendars have this date, show all
      const dayNames = matchingDays.map(d => d.name).join(", ");
      const calendarNames = [...new Set(matchingDays.map(d => d.calendarName))].join(", ");
      return { 
        isHoliday: true, 
        dayName: dayNames,
        calendarName: calendarNames
      };
    }
    return { isHoliday: false };
  }, [calendarDays]);

  // Validate milestone date - memoized to avoid recreating on every render
  const validateMilestoneDate = useCallback((dateString: string): string => {
    if (!dateString) return "";
    
    // Validate date is within plan period
    if (startDate && dateString < startDate) {
      return `La fecha debe ser posterior o igual a la fecha de inicio del plan (${startDate})`;
    }
    if (endDate && dateString > endDate) {
      return `La fecha debe ser anterior o igual a la fecha de fin del plan (${endDate})`;
    }
    
    // Check if it's a weekend
    if (isWeekend(dateString)) {
      return "La fecha no puede ser un fin de semana (sábado o domingo)";
    }
    
    // Check if it's a holiday or special day in ANY calendar associated with the plan
    const holidayCheck = isHolidayOrSpecialDay(dateString);
    if (holidayCheck.isHoliday) {
      const calendarInfo = holidayCheck.calendarName
        ? ` (en ${holidayCheck.calendarName})`
        : "";
      return `La fecha no puede ser un día festivo o especial: ${holidayCheck.dayName}${calendarInfo}`;
    }
    
    return "";
  }, [startDate, endDate, isHolidayOrSpecialDay]);

  // Validate URL format
  const validateUrl = (urlString: string): boolean => {
    if (!urlString.trim()) return true; // Empty is valid (optional field)
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (open) {
      if (reference) {
        setType(reference.type);
        setTitle(reference.title);
        setUrl(reference.url || "");
        setDescription(reference.description || "");
        const refColor = reference.milestoneColor || "#F44336";
        setMilestoneColor(refColor);
        setCustomColor(refColor);
        setUseCustomColor(!MILESTONE_COLORS.some(c => c.value === refColor));
        setMilestoneDate(reference.date || "");
        setMilestonePhaseId(reference.phaseId || "");
        setMilestoneDescription(reference.description || "");
        setUrlError("");
        setDateError("");
      } else {
        setType("link");
        setTitle("");
        setUrl("");
        setDescription("");
        setMilestoneColor("#F44336");
        setCustomColor("#F44336");
        setUseCustomColor(false);
        setMilestoneDate("");
        setMilestonePhaseId("");
        setMilestoneDescription("");
        setUrlError("");
        setDateError("");
      }
    }
  }, [open, reference]);

  // Validate date when it changes or when calendars finish loading
  // Track if calendars are loading - use a stable value
  const isLoadingCalendars = useMemo(() => {
    return calendarIds.length > 0 && calendarQueries.some(q => q.isLoading);
  }, [calendarIds.length, calendarQueries]);

  useEffect(() => {
    if (type === "milestone" && milestoneDate) {
      // Wait for calendars to load (or if there are no calendars, validate immediately)
      if (!isLoadingCalendars) {
        const error = validateMilestoneDate(milestoneDate);
        setDateError(error);
      }
    } else {
      setDateError("");
    }
  }, [milestoneDate, type, isLoadingCalendars, validateMilestoneDate]);

  // Validate URL when it changes (only for link type)
  useEffect(() => {
    if (type === "link" && url.trim() && !validateUrl(url)) {
      setUrlError("URL inválida. Debe comenzar con http:// o https://");
    } else {
      setUrlError("");
    }
  }, [url, type]);

  const handleSave = () => {
    if (!title.trim()) return;

    // Validate URL for link type
    if (type === "link" && url.trim() && !validateUrl(url)) {
      setUrlError("URL inválida. Debe comenzar con http:// o https://");
      return;
    }

    // Validate milestone requirements
    if (type === "milestone") {
      if (!milestoneDate) {
        setDateError("La fecha es obligatoria");
        return;
      }
      if (!milestonePhaseId) {
        return; // Will be handled by disabled button
      }
      const dateErr = validateMilestoneDate(milestoneDate);
      if (dateErr) {
        setDateError(dateErr);
        return;
      }
    }

    const now = new Date().toISOString();
    const finalColor = useCustomColor ? customColor : milestoneColor;
    // Generate a more unique ID using timestamp and random number to prevent duplicates
    const generateUniqueId = () => {
      if (reference?.id) return reference.id;
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      return `ref-${timestamp}-${random}`;
    };
    const referenceToSave: PlanReference = {
      id: generateUniqueId(),
      type,
      title: title.trim(),
      url: type === "link" && url.trim() ? url.trim() : undefined,
      description: type === "milestone" 
        ? milestoneDescription.trim() || undefined
        : description.trim() || undefined,
      createdAt: reference?.createdAt || now,
      updatedAt: now,
      // For milestone type, include date, phaseId, color, and description
      // Only include phaseId if it's a valid UUID (not a temporary ID like "phase-..." or empty string)
      ...(type === "milestone" && {
        date: milestoneDate,
        phaseId: milestonePhaseId && 
                 milestonePhaseId.trim() !== "" && 
                 !milestonePhaseId.startsWith("phase-") 
                 ? milestonePhaseId.trim() 
                 : undefined,
        milestoneColor: finalColor,
      }),
    };

    onSave(referenceToSave);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setType("link");
    setMilestoneColor("#F44336");
    setCustomColor("#F44336");
    setUseCustomColor(false);
    setMilestoneDate("");
    setMilestonePhaseId("");
    setMilestoneDescription("");
    setUrlError("");
    setDateError("");
    setColorPickerAnchor(null);
    onClose();
  };

  const getTypeIcon = (refType: PlanReferenceType) => {
    switch (refType) {
      case "link":
        return <LinkIcon sx={{ fontSize: 20 }} />;
      case "document":
        return <DocumentIcon sx={{ fontSize: 20 }} />;
      case "note":
        return <NoteIcon sx={{ fontSize: 20 }} />;
      case "milestone":
        return <MilestoneIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getTypeColor = (refType: PlanReferenceType) => {
    switch (refType) {
      case "link":
        return theme.palette.info.main;
      case "document":
        return theme.palette.primary.main;
      case "note":
        return theme.palette.warning.main;
      case "milestone":
        return milestoneColor || theme.palette.error.main;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 3,
          pt: 3.5,
          px: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          fontWeight: 600,
          fontSize: "1.0625rem",
          color: theme.palette.text.primary,
          letterSpacing: "-0.015em",
        }}
      >
        {isCreating ? "Nueva Referencia" : "Editar Referencia"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3.5, px: 3, pb: 2 }}>
        <Stack spacing={type === "milestone" ? 3 : 2.5}>
          {/* Type Selector - Minimalist Toggle Buttons */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 1,
                fontWeight: 500,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Tipo
            </Typography>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(_, newType) => newType && setType(newType)}
              fullWidth
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1,
                "& .MuiToggleButtonGroup-grouped": {
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  textTransform: "none",
                  "&:not(:first-of-type)": {
                    borderLeft: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    marginLeft: 0,
                  },
                  "&.Mui-selected": {
                    bgcolor: alpha(getTypeColor(type), 0.1),
                    borderColor: getTypeColor(type),
                    color: getTypeColor(type),
                    "&:hover": {
                      bgcolor: alpha(getTypeColor(type), 0.15),
                    },
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.action.hover, 0.04),
                  },
                },
              }}
            >
              <ToggleButton value="link">
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <LinkIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                    Enlace
                  </Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="document">
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <DocumentIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                    Documento
                  </Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="note">
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <NoteIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                    Nota
                  </Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="milestone">
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <MilestoneIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                    Hito
                  </Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Title Field */}
          <TextField
            id="reference-title-input"
            name="referenceTitle"
            label="Título"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingrese el título de la referencia"
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                transition: "all 0.2s ease",
                "&:hover fieldset": {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
            }}
          />

          {/* URL Field - Only for link type */}
          {type === "link" && (
            <TextField
              id="reference-url-input"
              name="referenceUrl"
              label="URL"
              fullWidth
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              variant="outlined"
              size="small"
              error={!!urlError}
              helperText={urlError || "Debe comenzar con http:// o https://"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                  transition: "all 0.2s ease",
                  "&:hover fieldset": {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "0.6875rem",
                  mt: 0.75,
                },
              }}
            />
          )}

          {/* Milestone-specific fields */}
          {type === "milestone" && (
            <>
              {/* Color Selector - Enhanced Minimalist Design */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    color: theme.palette.text.primary,
                    mb: 1.5,
                  }}
                >
                  Color
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    gap: 1,
                    alignItems: "center",
                    overflowX: "auto",
                    pb: 0.5,
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      bgcolor: alpha(theme.palette.divider, 0.05),
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: alpha(theme.palette.divider, 0.3),
                      borderRadius: 3,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.divider, 0.5),
                      },
                    },
                  }}
                >
                  {MILESTONE_COLORS.map((color) => {
                    const isSelected = !useCustomColor && milestoneColor === color.value;
                    return (
                      <Tooltip
                        key={color.value}
                        title={color.label}
                        arrow
                        placement="top"
                      >
                        <Box
                          onClick={() => {
                            setMilestoneColor(color.value);
                            setUseCustomColor(false);
                          }}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: color.value,
                            border: `2px solid ${
                              isSelected
                                ? theme.palette.common.white
                                : "transparent"
                            }`,
                            boxShadow: isSelected
                              ? `0 0 0 2px ${color.value}, 0 2px 6px ${alpha(color.value, 0.35)}`
                              : `0 1px 3px ${alpha(theme.palette.common.black, 0.12)}`,
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            "&:hover": {
                              transform: "scale(1.12)",
                              boxShadow: `0 0 0 2px ${theme.palette.common.white}, 0 3px 10px ${alpha(color.value, 0.45)}`,
                            },
                            "&:active": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          {isSelected && (
                            <CheckCircleIcon
                              sx={{
                                fontSize: 20,
                                color: "#fff",
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                  {/* Custom Color Button - Circle with three dots */}
                  <Tooltip title="Más colores" arrow placement="top">
                    <Box
                      onClick={(e) => {
                        setUseCustomColor(true);
                        setColorPickerAnchor(e.currentTarget);
                      }}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: useCustomColor
                          ? customColor
                          : alpha(theme.palette.grey[400], 0.15),
                        border: `2px solid ${
                          useCustomColor
                            ? theme.palette.common.white
                            : alpha(theme.palette.divider, 0.2)
                        }`,
                        boxShadow: useCustomColor
                          ? `0 0 0 2px ${customColor}, 0 2px 6px ${alpha(customColor, 0.35)}`
                          : `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}`,
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                          transform: "scale(1.12)",
                          bgcolor: useCustomColor
                            ? customColor
                            : alpha(theme.palette.grey[400], 0.2),
                          boxShadow: useCustomColor
                            ? `0 0 0 2px ${theme.palette.common.white}, 0 3px 10px ${alpha(customColor, 0.45)}`
                            : `0 2px 6px ${alpha(theme.palette.common.black, 0.15)}`,
                        },
                        "&:active": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {useCustomColor ? (
                        <CheckCircleIcon
                          sx={{
                            fontSize: 20,
                            color: "#fff",
                            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                          }}
                        />
                      ) : (
                        <MoreHorizIcon
                          sx={{
                            fontSize: 20,
                            color: theme.palette.text.secondary,
                          }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                </Box>
                {/* Color Picker Popover */}
                <Popover
                  open={Boolean(colorPickerAnchor)}
                  anchorEl={colorPickerAnchor}
                  onClose={() => setColorPickerAnchor(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    sx: {
                      borderRadius: 2.5,
                      p: 2,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    },
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 1.5,
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        color: theme.palette.text.secondary,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Color personalizado
                    </Typography>
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setMilestoneColor(e.target.value);
                      }}
                      style={{
                        width: "100%",
                        height: 48,
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        display: "block",
                      }}
                    />
                  </Box>
                </Popover>
              </Box>

              {/* Date and Phase Row - Enhanced Compact Layout */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2.5,
                }}
              >
                <TextField
                  id="milestone-date-input"
                  name="milestoneDate"
                  label="Fecha"
                  type="date"
                  fullWidth
                  required
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  error={!!dateError}
                  helperText={dateError ? undefined : "Dentro del período del plan"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: startDate,
                    max: endDate,
                  }}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: theme.palette.background.paper,
                      transition: "all 0.2s ease",
                      "&:hover fieldset": {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "0.6875rem",
                      mt: 0.75,
                      ml: 0,
                    },
                  }}
                />

                {phases.length > 0 ? (
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="milestone-phase-label" shrink>
                      Fase
                    </InputLabel>
                    <Select
                      id="milestone-phase-select"
                      labelId="milestone-phase-label"
                      value={milestonePhaseId}
                      onChange={(e) => setMilestonePhaseId(e.target.value)}
                      label="Fase"
                      error={!milestonePhaseId}
                      sx={{
                        borderRadius: 2,
                        bgcolor: theme.palette.background.paper,
                        transition: "all 0.2s ease",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        },
                      }}
                    >
                      {phases.map((phase) => (
                        <MenuItem key={phase.id} value={phase.id}>
                          {phase.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: 40,
                      px: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.06),
                      border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="error.main"
                      sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                    >
                      No hay fases disponibles
                    </Typography>
                  </Box>
                )}
              </Box>
              {dateError && (
                <Box
                  sx={{
                    mt: -1,
                    ml: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.error.main,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {dateError}
                  </Typography>
                </Box>
              )}

              {/* Milestone Description Field */}
              <TextField
                id="milestone-description-input"
                name="milestoneDescription"
                label="Descripción"
                fullWidth
                required
                multiline
                rows={3}
                value={milestoneDescription}
                onChange={(e) => setMilestoneDescription(e.target.value)}
                placeholder="Describa el hito y su importancia..."
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                    transition: "all 0.2s ease",
                    "&:hover fieldset": {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    py: 1.25,
                  },
                  "& .MuiInputBase-inputMultiline": {
                    py: 1.25,
                  },
                }}
              />
            </>
          )}

          {/* Description Field - Only for non-milestone types */}
          {type !== "milestone" && (
          <TextField
            id="reference-description-input"
            name="referenceDescription"
              label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              type === "note"
                  ? "Ingrese su nota u observación..."
                  : "Descripción opcional o notas..."
            }
            variant="outlined"
            size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                  transition: "all 0.2s ease",
                  "&:hover fieldset": {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                },
              }}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            color: theme.palette.text.secondary,
            px: 2.5,
            borderRadius: 2,
            "&:hover": {
              bgcolor: alpha(theme.palette.action.hover, 0.05),
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={
            !title.trim() ||
            (type === "link" && !url.trim()) ||
            (type === "milestone" && (!milestoneDate || !milestonePhaseId || !milestoneDescription.trim() || !!dateError)) ||
            !!urlError
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            borderRadius: 2,
            px: 3.5,
            py: 0.875,
            boxShadow: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&.Mui-disabled": {
              opacity: 0.45,
            },
          }}
        >
          {isCreating ? "Agregar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Force Vite cache refresh - ReferenceEditDialog fixed HTML nesting issue
