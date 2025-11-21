import { Box, Stack, Typography, Button, Checkbox, FormControlLabel, Alert, CircularProgress, useTheme, alpha } from "@mui/material";
import type { BasePhase } from "../../../../../../api/services/basePhases.service";

export type BasePhasesTabProps = {
  readonly isLoading: boolean;
  readonly availableBasePhases: BasePhase[];
  readonly selectedBasePhaseIds: Set<string>;
  readonly onPhaseToggle: (phaseId: string) => void;
  readonly onSelectAll: () => void;
};

export function BasePhasesTab({
  isLoading,
  availableBasePhases,
  selectedBasePhaseIds,
  onPhaseToggle,
  onSelectAll,
}: BasePhasesTabProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
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
    );
  }

  if (availableBasePhases.length === 0) {
    return (
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
    );
  }

  const selectAllText = selectedBasePhaseIds.size === availableBasePhases.length
    ? "Deselect all"
    : "Select all";

  return (
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
          {selectedBasePhaseIds.size} de {availableBasePhases.length} fases seleccionadas
        </Typography>
        <Button
          size="small"
          onClick={onSelectAll}
          sx={{
            textTransform: "none",
            fontSize: "0.8125rem",
            fontWeight: 500,
          }}
        >
          {selectAllText}
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
                      onChange={() => onPhaseToggle(basePhase.id)}
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
  );
}

