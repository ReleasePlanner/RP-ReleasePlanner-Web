import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Collapse, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Plan } from "../types";
import GanttChart from "./GanttChart";
import PlanHeader from "./Plan/PlanHeader";
import ResizableSplit from "./Plan/ResizableSplit";
import PhaseEditDialog from "./Plan/PhaseEditDialog";
import CommonDataCard from "./Plan/CommonDataCard";
import PhasesList from "./Plan/PhasesList";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addPhase, updatePhase } from "../slice";
import { setPlanLeftPercent, setPlanExpanded } from "../../../store/store";

// left pane subcomponents handle their own label formatting

export type PlanCardProps = {
  plan: Plan;
};

export default function PlanCard({ plan }: PlanCardProps) {
  const { metadata, tasks } = plan;
  const dispatch = useAppDispatch();
  const savedPercent = useAppSelector((s) => s.ui.planLeftPercentByPlanId?.[plan.id]);
  const [leftPercent, setLeftPercent] = useState<number>(savedPercent ?? 35);
  const savedExpanded = useAppSelector((s) => s.ui.planExpandedByPlanId?.[plan.id]);
  const expanded = savedExpanded ?? true;
  // Add Phase dialog
  const [phaseOpen, setPhaseOpen] = useState(false);
  const [phaseName, setPhaseName] = useState("");
  const submitPhase = useCallback(() => {
    const name = phaseName.trim();
    if (name) {
      dispatch(addPhase({ planId: plan.id, name }));
      setPhaseName("");
      setPhaseOpen(false);
    }
  }, [dispatch, phaseName, plan.id]);

  // Edit Phase dialog (start/end/color)
  const [editOpen, setEditOpen] = useState(false);
  const [editPhaseId, setEditPhaseId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editColor, setEditColor] = useState("#217346");
  const openEdit = useCallback(
    (phaseId: string) => {
      const ph = (plan.metadata.phases ?? []).find((x) => x.id === phaseId);
      if (!ph) return;
      setEditPhaseId(phaseId);
      setEditStart(ph.startDate ?? "");
      setEditEnd(ph.endDate ?? "");
      setEditColor(ph.color ?? "#217346");
      setEditOpen(true);
    },
    [plan.metadata.phases]
  );
  const saveEdit = useCallback(() => {
    if (!editPhaseId) return;
    dispatch(
      updatePhase({
        planId: plan.id,
        phaseId: editPhaseId,
        changes: { startDate: editStart, endDate: editEnd, color: editColor },
      })
    );
    setEditOpen(false);
  }, [dispatch, plan.id, editPhaseId, editStart, editEnd, editColor]);
  return (
    <Card variant="outlined" className="mb-6">
      <PlanHeader
        name={metadata.name}
        status={metadata.status}
        description={metadata.description}
        expanded={expanded}
        onToggleExpanded={() => dispatch(setPlanExpanded({ planId: plan.id, expanded: !expanded }))}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <ResizableSplit
            leftPercent={leftPercent}
            onLeftPercentChange={(v) => { setLeftPercent(v); dispatch(setPlanLeftPercent({ planId: plan.id, percent: v })); }}
            left={<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CommonDataCard owner={metadata.owner} startDate={metadata.startDate} endDate={metadata.endDate} id={metadata.id} />
              <PhasesList phases={metadata.phases ?? []} onAdd={() => setPhaseOpen(true)} onEdit={openEdit} />
            </div>}
            right={
              <GanttChart
                startDate={metadata.startDate}
                endDate={metadata.endDate}
                tasks={tasks}
                phases={metadata.phases}
                onPhaseRangeChange={(phaseId, s, e) =>
                  dispatch(
                    updatePhase({
                      planId: plan.id,
                      phaseId,
                      changes: { startDate: s, endDate: e },
                    })
                  )
                }
              />
            }
          />
        </CardContent>
      </Collapse>
      <Dialog
        open={phaseOpen}
        onClose={() => setPhaseOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add Phase</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Phase name"
            type="text"
            fullWidth
            variant="outlined"
            value={phaseName}
            onChange={(e) => setPhaseName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitPhase();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhaseOpen(false)}>Cancel</Button>
          <Button onClick={submitPhase} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <PhaseEditDialog
        open={editOpen}
        start={editStart}
        end={editEnd}
        color={editColor}
        onStartChange={setEditStart}
        onEndChange={setEditEnd}
        onColorChange={setEditColor}
        onCancel={() => setEditOpen(false)}
        onSave={saveEdit}
      />
    </Card>
  );
}
