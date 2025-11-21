import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, useTheme, alpha } from "@mui/material";
import type { PlanPhase } from "../../../../../types";

export type MilestoneDatePhaseFieldsProps = {
  readonly milestoneDate: string;
  readonly milestonePhaseId: string;
  readonly phases: PlanPhase[];
  readonly startDate?: string;
  readonly endDate?: string;
  readonly dateError?: string;
  readonly onDateChange: (date: string) => void;
  readonly onPhaseChange: (phaseId: string) => void;
};

export function MilestoneDatePhaseFields({
  milestoneDate,
  milestonePhaseId,
  phases,
  startDate,
  endDate,
  dateError,
  onDateChange,
  onPhaseChange,
}: MilestoneDatePhaseFieldsProps) {
  const theme = useTheme();

  return (
    <>
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
          onChange={(e) => onDateChange(e.target.value)}
          error={!!dateError}
          helperText={dateError ? undefined : "Dentro del período del plan"}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: {
              min: startDate,
              max: endDate,
            },
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
              onChange={(e) => onPhaseChange(e.target.value)}
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
    </>
  );
}

