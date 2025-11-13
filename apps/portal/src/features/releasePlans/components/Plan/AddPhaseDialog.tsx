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
} from "@mui/material";
import {
  Add as AddIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { useCallback, useState, useEffect } from "react";

type AddPhaseDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  existingPhaseNames?: string[]; // Names of existing phases to validate uniqueness
};

export default function AddPhaseDialog({
  open,
  onClose,
  onSubmit,
  existingPhaseNames = [],
}: AddPhaseDialogProps) {
  const theme = useTheme();
  const [phaseName, setPhaseName] = useState("");
  const [error, setError] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);

  // Validate phase name uniqueness
  const validatePhaseName = useCallback(
    (name: string): boolean => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError("El nombre de la fase es requerido");
        return false;
      }

      const normalizedExisting = existingPhaseNames.map((n) =>
        n.toLowerCase().trim()
      );
      const normalizedNew = trimmedName.toLowerCase().trim();

      if (normalizedExisting.includes(normalizedNew)) {
        setError("Ya existe una fase con este nombre en el plan");
        return false;
      }

      setError("");
      return true;
    },
    [existingPhaseNames]
  );

  const submitPhase = useCallback(() => {
    const name = phaseName.trim();
    if (validatePhaseName(name)) {
      onSubmit(name);
      setPhaseName("");
      setError("");
      onClose();
    }
  }, [onSubmit, phaseName, onClose, validatePhaseName]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setPhaseName("");
      setError("");
      setIsValidating(false);
    }
  }, [open]);

  // Validate on name change with debounce
  useEffect(() => {
    if (!open) return;

    const trimmedName = phaseName.trim();
    if (!trimmedName) {
      setError("");
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      validatePhaseName(trimmedName);
      setIsValidating(false);
    }, 300); // Debounce validation

    return () => clearTimeout(timeoutId);
  }, [phaseName, open, validatePhaseName]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && phaseName.trim() && !error && !isValidating) {
      e.preventDefault();
      submitPhase();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const isFormValid = phaseName.trim() !== "" && !error && !isValidating;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.palette.mode === "dark"
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
          py: 2.5,
          px: 3,
          background: theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
              Agregar Nueva Fase
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8125rem",
                color: theme.palette.text.secondary,
                fontWeight: 400,
              }}
            >
              Crea una nueva fase para tu plan de release
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 4, pb: 2, px: 3 }}>
        <Stack spacing={2.5}>
          {/* Phase Name Input */}
          <Box sx={{ mt: 3 }}>
            <TextField
              autoFocus
              fullWidth
              size="medium"
              label="Nombre de la Fase"
              placeholder="Ej: Planning, Development, Testing..."
              value={phaseName}
              onChange={(e) => setPhaseName(e.target.value)}
              onKeyDown={handleKeyDown}
              error={!!error}
              InputLabelProps={{
                shrink: false, // Let label be visible inside field when empty
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
                ) : phaseName.trim() ? (
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
                          : phaseName.trim()
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
          </Box>

          {/* Info Alert */}
          {phaseName.trim() && !error && (
            <Fade in={phaseName.trim() && !error}>
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
                La fase se creará con fechas por defecto que podrás ajustar después
              </Alert>
            </Fade>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
          Cancelar
        </Button>
        <Button
          onClick={submitPhase}
          variant="contained"
          disabled={!isFormValid}
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            boxShadow: theme.palette.mode === "dark"
              ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              : `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: theme.palette.mode === "dark"
                ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`
                : `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Agregar Fase
        </Button>
      </DialogActions>
    </Dialog>
  );
}
