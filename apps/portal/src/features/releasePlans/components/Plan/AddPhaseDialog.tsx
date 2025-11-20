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
  Checkbox,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
  Palette as PaletteIcon,
  LibraryBooks as LibraryBooksIcon,
  Create as CreateIcon,
} from "@mui/icons-material";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useBasePhases } from "../../../../api/hooks";
import type { BasePhase } from "../../../../api/services/basePhases.service";
import type { PlanPhase } from "../../../types";

type AddPhaseDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (phases: PlanPhase[]) => void;
  existingPhases?: PlanPhase[]; // Existing phases in the plan
  planStartDate?: string; // Plan start date for assigning default phase dates
  planEndDate?: string; // Plan end date for assigning default phase dates
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`add-phase-tabpanel-${index}`}
      aria-labelledby={`add-phase-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AddPhaseDialog({
  open,
  onClose,
  onSubmit,
  existingPhases = [],
  planStartDate,
  planEndDate,
}: AddPhaseDialogProps) {
  const theme = useTheme();
  const { data: basePhases = [], isLoading: isLoadingBasePhases } = useBasePhases();
  const [tabValue, setTabValue] = useState(0);
  
  // State for maintenance phases selection
  const [selectedBasePhaseIds, setSelectedBasePhaseIds] = useState<Set<string>>(new Set());
  
  // State for new phase creation
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseColor, setNewPhaseColor] = useState("#1976D2");
  const [error, setError] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);

  // Get existing phase names for validation
  const existingPhaseNames = useMemo(
    () => existingPhases.map((p) => p.name.toLowerCase().trim()),
    [existingPhases]
  );

  // Filter base phases that are not yet in the plan
  const availableBasePhases = useMemo(() => {
    const existingNames = new Set(
      existingPhases.map((p) => p.name.toLowerCase().trim())
    );
    return basePhases.filter(
      (bp) => !existingNames.has(bp.name.toLowerCase().trim())
    );
  }, [basePhases, existingPhases]);

  // Predefined colors for new phases
  const predefinedColors = [
    "#1976D2", // Blue
    "#388E3C", // Green
    "#FBC02D", // Yellow
    "#D32F2F", // Red
    "#7B1FA2", // Purple
    "#455A64", // Gray
    "#E64A19", // Orange
    "#0097A7", // Cyan
    "#5D4037", // Brown
    "#C2185B", // Pink
  ];

  // Validate new phase name uniqueness
  const validatePhaseName = useCallback(
    (name: string): boolean => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError("El nombre de la fase es requerido");
        return false;
      }

      const normalizedNew = trimmedName.toLowerCase().trim();

      if (existingPhaseNames.includes(normalizedNew)) {
        setError("Ya existe una fase con este nombre en el plan");
        return false;
      }

      setError("");
      return true;
    },
    [existingPhaseNames]
  );

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedBasePhaseIds(new Set());
      setNewPhaseName("");
      setNewPhaseColor("#1976D2");
      setError("");
      setIsValidating(false);
      setTabValue(0);
    }
  }, [open]);

  // Validate on name change with debounce
  useEffect(() => {
    if (!open || tabValue !== 1) return;

    const trimmedName = newPhaseName.trim();
    if (!trimmedName) {
      setError("");
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      validatePhaseName(trimmedName);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [newPhaseName, open, tabValue, validatePhaseName]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError("");
  };

  const handleBasePhaseToggle = (phaseId: string) => {
    setSelectedBasePhaseIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  const handleSelectAllBasePhases = () => {
    if (selectedBasePhaseIds.size === availableBasePhases.length) {
      setSelectedBasePhaseIds(new Set());
    } else {
      setSelectedBasePhaseIds(new Set(availableBasePhases.map((bp) => bp.id)));
    }
  };

  const handleSubmit = useCallback(() => {
    const phasesToAdd: PlanPhase[] = [];

    if (tabValue === 0) {
      // Add selected base phases with default one-week duration
      // All phases start on the same day (plan startDate), each with one week duration
      const selectedBasePhases = Array.from(selectedBasePhaseIds)
        .map((phaseId) => basePhases.find((bp) => bp.id === phaseId))
        .filter((bp): bp is BasePhase => bp !== undefined);
      
      selectedBasePhases.forEach((basePhase, index) => {
        // Calculate default dates: all phases start the same day, each with one week duration
        let startDate = "";
        let endDate = "";
        
        if (planStartDate) {
          // All phases start on the same day (plan start date)
          const phaseStart = new Date(planStartDate);
          
          // End date: one week (7 days) after start date
          const phaseEnd = new Date(phaseStart);
          phaseEnd.setDate(phaseEnd.getDate() + 7);
          
          startDate = phaseStart.toISOString().slice(0, 10);
          endDate = phaseEnd.toISOString().slice(0, 10);
        } else {
          // Fallback: use current date + one week if plan dates are not available
          const today = new Date();
          const weekLater = new Date(today);
          weekLater.setDate(weekLater.getDate() + 7);
          startDate = today.toISOString().slice(0, 10);
          endDate = weekLater.toISOString().slice(0, 10);
        }
        
        phasesToAdd.push({
          id: `phase-${Date.now()}-${index}-${basePhase.id}`,
          name: basePhase.name,
          color: basePhase.color,
          startDate,
          endDate,
        });
      });
    } else {
      // Add new custom phase with default one-week duration
      // Starts on the same day as plan startDate (or existing phases if any)
      if (!validatePhaseName(newPhaseName)) return;
      
      let startDate = "";
      let endDate = "";
      
      if (planStartDate) {
        // Start on plan start date (same as base phases)
        const phaseStart = new Date(planStartDate);
        
        // End date: one week (7 days) after start date
        const phaseEnd = new Date(phaseStart);
        phaseEnd.setDate(phaseEnd.getDate() + 7);
        
        startDate = phaseStart.toISOString().slice(0, 10);
        endDate = phaseEnd.toISOString().slice(0, 10);
      } else {
        // Fallback: use current date + one week
        const today = new Date();
        const weekLater = new Date(today);
        weekLater.setDate(weekLater.getDate() + 7);
        startDate = today.toISOString().slice(0, 10);
        endDate = weekLater.toISOString().slice(0, 10);
      }
      
      phasesToAdd.push({
        id: `phase-${Date.now()}-custom`,
        name: newPhaseName.trim(),
        color: newPhaseColor,
        startDate,
        endDate,
      });
    }

    if (phasesToAdd.length > 0) {
      onSubmit(phasesToAdd);
      onClose();
    }
  }, [tabValue, selectedBasePhaseIds, basePhases, newPhaseName, newPhaseColor, validatePhaseName, onSubmit, onClose, existingPhases, planStartDate, planEndDate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const canSubmit =
    tabValue === 0
      ? selectedBasePhaseIds.size > 0
      : newPhaseName.trim() !== "" && !error && !isValidating;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
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
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          fontWeight: 600,
          fontSize: "1.25rem",
          color: theme.palette.text.primary,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <AddIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.25rem",
                letterSpacing: "-0.01em",
                color: theme.palette.text.primary,
                mb: 0.25,
              }}
            >
              Add Phases
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8125rem",
                color: theme.palette.text.secondary,
                fontWeight: 400,
              }}
            >
              Select phases from maintenance or create a new phase only for this plan
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2, pb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            mb: 0,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 48,
            },
          }}
        >
          <Tab
            icon={<LibraryBooksIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="From Maintenance"
            id="add-phase-tab-0"
            aria-controls="add-phase-tabpanel-0"
          />
          <Tab
            icon={<CreateIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="New Phase"
            id="add-phase-tab-1"
            aria-controls="add-phase-tabpanel-1"
          />
        </Tabs>

        {/* Tab 1: Select from Maintenance */}
        <TabPanel value={tabValue} index={0}>
          {isLoadingBasePhases ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress size={32} />
            </Box>
          ) : availableBasePhases.length === 0 ? (
            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
                "& .MuiAlert-message": {
                  fontSize: "0.875rem",
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                All maintenance phases are already in the plan
              </Typography>
              <Typography variant="body2">
                You can create a new phase only for this plan using the "New Phase" tab
              </Typography>
            </Alert>
          ) : (
            <Stack spacing={2}>
              {/* Select All */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {selectedBasePhaseIds.size} de {availableBasePhases.length}{" "}
                  fases seleccionadas
                </Typography>
                <Button
                  size="small"
                  onClick={handleSelectAllBasePhases}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  {selectedBasePhaseIds.size === availableBasePhases.length
                    ? "Deselect all"
                    : "Select all"}
                </Button>
              </Box>

              {/* Phase List */}
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <Stack spacing={0.5}>
                  {availableBasePhases.map((basePhase) => {
                    const isSelected = selectedBasePhaseIds.has(basePhase.id);
                    return (
                      <Box
                        key={basePhase.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: isSelected
                            ? alpha(theme.palette.primary.main, 0.08)
                            : "transparent",
                          border: `1px solid ${
                            isSelected
                              ? alpha(theme.palette.primary.main, 0.2)
                              : "transparent"
                          }`,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              id={`base-phase-checkbox-${basePhase.id}`}
                              name={`basePhase-${basePhase.id}`}
                              checked={isSelected}
                              onChange={() => handleBasePhaseToggle(basePhase.id)}
                              sx={{
                                color: basePhase.color,
                                "&.Mui-checked": {
                                  color: basePhase.color,
                                },
                              }}
                            />
                          }
                          label={
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 1,
                                  bgcolor: basePhase.color,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: isSelected ? 600 : 500,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {basePhase.name}
                              </Typography>
                            </Stack>
                          }
                          sx={{
                            m: 0,
                            width: "100%",
                            "& .MuiFormControlLabel-label": {
                              flex: 1,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </Stack>
          )}
        </TabPanel>

        {/* Tab 2: Create New Phase */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            {/* Phase Name Input */}
            <TextField
              id="add-phase-name-input"
              name="phaseName"
              autoFocus
              fullWidth
              size="medium"
              label="Nombre de la Fase"
              placeholder="Ej: Planning, Development, Testing..."
              value={newPhaseName}
              onChange={(e) => setNewPhaseName(e.target.value)}
              onKeyDown={handleKeyDown}
              error={!!error}
              InputLabelProps={{
                shrink: false,
                sx: {
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  "&.MuiInputLabel-shrink": {
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    backgroundColor: theme.palette.background.paper,
                    px: 0.5,
                    color: theme.palette.text.primary,
                  },
                  "&.Mui-focused": {
                    color: error
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                  },
                },
              }}
              helperText={
                error ? (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.8125rem",
                    }}
                  >
                    <ErrorIcon sx={{ fontSize: 16 }} />
                    {error}
                  </Box>
                ) : isValidating ? (
                  "Validando..."
                ) : newPhaseName.trim() ? (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.8125rem",
                      color: theme.palette.success.main,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
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
                        fontSize: 20,
                        color: error
                          ? theme.palette.error.main
                          : newPhaseName.trim()
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
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: error
                        ? theme.palette.error.main
                        : theme.palette.primary.main,
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                      borderColor: error
                        ? theme.palette.error.main
                        : theme.palette.primary.main,
                    },
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: 0,
                  marginTop: 1,
                  fontSize: "0.8125rem",
                },
              }}
            />

            {/* Color Picker */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: theme.palette.text.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PaletteIcon sx={{ fontSize: 18 }} />
                Color de la Fase
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {predefinedColors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setNewPhaseColor(color)}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      bgcolor: color,
                      cursor: "pointer",
                      border:
                        newPhaseColor === color
                          ? `3px solid ${theme.palette.common.white}`
                          : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                      boxShadow:
                        newPhaseColor === color
                          ? `0 0 0 2px ${color}, 0 2px 8px ${alpha(
                              theme.palette.common.black,
                              0.2
                            )}`
                          : "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: `0 2px 8px ${alpha(color, 0.4)}`,
                      },
                    }}
                  />
                ))}
              </Stack>
              <Box
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: alpha(newPhaseColor, 0.1),
                  border: `1px solid ${alpha(newPhaseColor, 0.2)}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: newPhaseColor,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  }}
                >
                  Vista previa del color seleccionado
                </Typography>
              </Box>
            </Box>

            {/* Info Alert */}
            {newPhaseName.trim() && !error && (
              <Fade in={newPhaseName.trim() && !error}>
                <Alert
                  severity="info"
                  icon={<TimelineIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    borderRadius: 2,
                    fontSize: "0.8125rem",
                    backgroundColor: alpha(theme.palette.info.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    "& .MuiAlert-icon": {
                      color: theme.palette.info.main,
                    },
                    "& .MuiAlert-message": {
                      color: theme.palette.text.secondary,
                    },
                  }}
                >
                  This phase will only exist in this plan and will not be saved to
                  phase maintenance
                </Alert>
              </Fade>
            )}
          </Stack>
        </TabPanel>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            px: 2.5,
            py: 1,
            borderRadius: 1.5,
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: alpha(theme.palette.action.hover, 0.5),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit}
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                : `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "dark"
                  ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`
                  : `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          {tabValue === 0
            ? `Add ${selectedBasePhaseIds.size} Phase${selectedBasePhaseIds.size !== 1 ? "s" : ""}`
            : "Create Phase"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
