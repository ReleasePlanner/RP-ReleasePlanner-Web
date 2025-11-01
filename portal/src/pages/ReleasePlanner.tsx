import { Button, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import PlanCard from "../features/releasePlans/components/PlanCard";
import { setPlanExpanded } from "../store/store";

export default function ReleasePlanner() {
  const plans = useAppSelector((s) => s.releasePlans.plans);
  const dispatch = useAppDispatch();
  if (!plans.length) return null;
  return (
    <div>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button size="small" variant="outlined" onClick={() => plans.forEach((p) => dispatch(setPlanExpanded({ planId: p.id, expanded: true })))}>Expand all</Button>
        <Button size="small" variant="outlined" onClick={() => plans.forEach((p) => dispatch(setPlanExpanded({ planId: p.id, expanded: false })))}>Collapse all</Button>
      </Stack>
      {plans.map((p) => (
        <PlanCard key={p.id} plan={p} />
      ))}
    </div>
  );
}
