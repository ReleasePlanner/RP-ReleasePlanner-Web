/**
 * Phase Maintenance Page
 *
 * Minimalist page for managing phases across all release plans
 */

import { Box, Button } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks";

export function PhaseMaintenancePage() {
  const dispatch = useAppDispatch();
  const phases = useAppSelector((state) => state.basePhases.phases);

  const handleAddPhase = () => {
    dispatch(
      addBasePhase({
        id: `base-${Date.now()}`,
        name: "Nueva fase",
        color: "#185ABD",
        category: "",
      })
    );
  };

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        maxWidth: 900,
        mx: "auto",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleAddPhase}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
        >
          Nueva fase
        </Button>
      </Box>
      <Box sx={{ display: "grid", gap: 2 }}>
        {phases.length === 0 ? (
          <Box sx={{ textAlign: "center", color: "text.secondary", py: 8 }}>
            No hay fases registradas.
          </Box>
        ) : (
          phases.map((phase) => (
            <Box
              key={phase.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 0,
                border: `1px solid #eee`,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  bgcolor: phase.color,
                  border: `1px solid #eee`,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <strong>{phase.name}</strong>
                {phase.category && (
                  <span
                    style={{ color: "#888", fontSize: "0.9em", marginLeft: 8 }}
                  >
                    {phase.category}
                  </span>
                )}
              </Box>
              <Button
                size="small"
                variant="text"
                sx={{ textTransform: "none" }}
              >
                Editar
              </Button>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
