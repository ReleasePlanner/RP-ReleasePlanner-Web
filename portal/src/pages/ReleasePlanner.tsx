import React from "react";
import { Box, Stack, Fab, Tooltip, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  UnfoldMore as ExpandIcon,
  UnfoldLess as CollapseIcon,
} from "@mui/icons-material";
// Removed duplicate import of AddIcon
import AddPlanDialog from "../features/releasePlans/components/AddPlanDialog";
import { addPlan } from "../features/releasePlans/slice";
import type { Plan } from "../features/releasePlans/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import PlanCard from "../features/releasePlans/components/PlanCard/PlanCard";
import { setPlanExpanded } from "../store/store";

export default function ReleasePlanner() {
  const plans = useAppSelector((s) => s.releasePlans.plans);
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleAddButtonClick = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogSubmit = (name: string, description: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const id = `plan-${Date.now()}`;
    const newPlan: Plan = {
      id,
      metadata: {
        id,
        name,
        owner: "Unassigned",
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        status: "planned",
        description,
      },
      tasks: [],
    };
    dispatch(addPlan(newPlan));
    setDialogOpen(false);
  };
  if (!plans.length) return null;

  return (
    <>
      <Box sx={{ position: "relative", px: { xs: 1, sm: 2 }, pt: 0.1 }}>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            mb: 0,
            alignItems: "center",
            justifyContent: "flex-end",
            minHeight: 28,
            mt: 0.1,
          }}
        >
          <Tooltip title="Crear nuevo plan de release" arrow>
            <Fab
              size="small"
              color="primary"
              aria-label="Crear nuevo plan de release"
              onClick={handleAddButtonClick}
              sx={{ minHeight: 36, height: 36, width: 36, boxShadow: 0 }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
            </Fab>
          </Tooltip>
          <Tooltip title="Expandir todos" arrow>
            <IconButton
              size="small"
              color="default"
              aria-label="Expandir todos"
              onClick={() =>
                plans.forEach((p) =>
                  dispatch(setPlanExpanded({ planId: p.id, expanded: true }))
                )
              }
              sx={{ p: 0.75 }}
            >
              <ExpandIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Colapsar todos" arrow>
            <IconButton
              size="small"
              color="default"
              aria-label="Colapsar todos"
              onClick={() =>
                plans.forEach((p) =>
                  dispatch(setPlanExpanded({ planId: p.id, expanded: false }))
                )
              }
              sx={{ p: 0.75 }}
            >
              <CollapseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack spacing={0.05} sx={{ mt: -1.5 }}>
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </Stack>
      </Box>
      <AddPlanDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
}
