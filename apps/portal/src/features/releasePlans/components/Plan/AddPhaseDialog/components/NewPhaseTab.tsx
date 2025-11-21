import { Stack, TextField, Box, Typography, Alert, Fade, useTheme, alpha, InputAdornment } from "@mui/material";
import { Timeline as TimelineIcon, CheckCircle as CheckCircleIcon, ErrorOutline as ErrorIcon, Palette as PaletteIcon } from "@mui/icons-material";

const PREDEFINED_COLORS = [
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

function getHelperText(error: string, isValidating: boolean, hasValue: boolean): React.ReactNode {
  if (error) {
    return (
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
    );
  }
  
  if (isValidating) {
    return "Validando...";
  }
  
  if (hasValue) {
    return (
      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.8125rem",
          color: "success.main",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 16 }} />
        Nombre disponible
      </Box>
    );
  }
  
  return "Ingresa un nombre único para la fase";
}

function getIconColor(error: string, hasValue: boolean, theme: ReturnType<typeof useTheme>): string {
  if (error) {
    return theme.palette.error.main;
  }
  if (hasValue) {
    return theme.palette.success.main;
  }
  return theme.palette.text.secondary;
}

export type NewPhaseTabProps = {
  readonly phaseName: string;
  readonly phaseColor: string;
  readonly error: string;
  readonly isValidating: boolean;
  readonly onNameChange: (value: string) => void;
  readonly onColorChange: (color: string) => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;
};

export function NewPhaseTab({
  phaseName,
  phaseColor,
  error,
  isValidating,
  onNameChange,
  onColorChange,
  onKeyDown,
}: NewPhaseTabProps) {
  const theme = useTheme();
  const hasValue = phaseName.trim() !== "";
  const iconColor = getIconColor(error, hasValue, theme);

  return (
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
        value={phaseName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={onKeyDown}
        error={!!error}
        slotProps={{
          inputLabel: {
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
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <TimelineIcon
                  sx={{
                    fontSize: 20,
                    color: iconColor,
                    transition: "color 0.2s ease",
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
        helperText={getHelperText(error, isValidating, hasValue)}
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
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: 2,
              borderColor: error
                ? theme.palette.error.main
                : theme.palette.primary.main,
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
          {PREDEFINED_COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => onColorChange(color)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: color,
                cursor: "pointer",
                border:
                  phaseColor === color
                    ? `3px solid ${theme.palette.common.white}`
                    : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                boxShadow:
                  phaseColor === color
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
            bgcolor: alpha(phaseColor, 0.1),
            border: `1px solid ${alpha(phaseColor, 0.2)}`,
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
              bgcolor: phaseColor,
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
      {hasValue && !error && (
        <Fade in={hasValue && !error}>
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
  );
}

