import { Button, Box, Stack, Fab, Tooltip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import PlanCard from "../features/releasePlans/components/PlanCard/PlanCard";
import { setPlanExpanded } from "../store/store";
import { addPlan } from "../features/releasePlans/slice";
import type { Plan } from "../features/releasePlans/types";

export default function ReleasePlanner() {
  const plans = useAppSelector((s) => s.releasePlans.plans);
  const dispatch = useAppDispatch();

  /**
   * Handle adding a new release plan
   */
  const handleAddRelease = () => {
    const now = new Date();
    const year = now.getFullYear();
    const id = `plan-${Date.now()}`;
    const newPlan: Plan = {
      id,
      metadata: {
        id,
        name: "New Release",
        owner: "Unassigned",
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        status: "planned",
        description: "",
      },
      tasks: [],
    };
    dispatch(addPlan(newPlan));
  };

  if (!plans.length)
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Tooltip title="Create new release plan" placement="left" arrow>
          <Fab
            color="primary"
            aria-label="Create new release plan"
            onClick={handleAddRelease}
            sx={{
              mb: 2,
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    );

  return (
    <Box sx={{ position: "relative" }}>
      {/* Header Section with Controls */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Controls */}
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              plans.forEach((p) =>
                dispatch(setPlanExpanded({ planId: p.id, expanded: true }))
              )
            }
          >
            Expand all
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              plans.forEach((p) =>
                dispatch(setPlanExpanded({ planId: p.id, expanded: false }))
              )
            }
          >
            Collapse all
          </Button>
        </Stack>

        {/* Right Action - Add New Release Plan FAB */}
        <Tooltip title="Create new release plan" placement="left" arrow>
          <Fab
            size="small"
            color="primary"
            aria-label="Create new release plan"
            onClick={handleAddRelease}
            sx={{
              minHeight: 40,
              height: 40,
              width: 40,
            }}
          >
            <AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </Fab>
        </Tooltip>
      </Stack>

      {/* Plans List */}
      <Stack spacing={1}>
        {plans.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </Stack>
    </Box>
  );
}
