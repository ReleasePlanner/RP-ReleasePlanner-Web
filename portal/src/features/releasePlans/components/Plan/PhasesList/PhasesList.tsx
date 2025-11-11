import { Button, List, Fab } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import type { PlanPhase } from "../../../types";
import PhaseListItem from "../PhaseListItem/PhaseListItem";
import MiniPhaseTimeline from "../MiniPhaseTimeline/MiniPhaseTimeline";
import { TRACK_HEIGHT, LANE_GAP, LABEL_WIDTH } from "../../Gantt/constants";

export type PhasesListProps = {
  phases: PlanPhase[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onAutoGenerate?: () => void;
  calendarStart?: string;
  calendarEnd?: string;
  headerOffsetTopPx?: number;
  onPhaseRangeChange?: (id: string, start: string, end: string) => void;
};

export default function PhasesList({
  phases,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onAutoGenerate,
  calendarStart,
  calendarEnd,
  headerOffsetTopPx: _headerOffsetTopPx,
  onPhaseRangeChange,
}: PhasesListProps) {
  return (
    <div>
      {/* Align first phase with the first calendar row below header, compensating toolbar height (TRACK_HEIGHT + LANE_GAP) */}
      <div
        style={{
          paddingTop: Math.max(
            0,
            (_headerOffsetTopPx ?? 0) - (TRACK_HEIGHT + LANE_GAP)
          ),
        }}
      />
      <List dense disablePadding>
        {/* Add button row inside the list, aligned to the right within the title column */}
        <div
          className="relative bg-white"
          style={{ height: TRACK_HEIGHT, marginBottom: LANE_GAP }}
        >
          <div
            className="flex items-center h-full"
            style={{ width: LABEL_WIDTH, paddingRight: 8 }}
          >
            <div className="ml-auto pr-1">
              <Fab
                aria-label="Add"
                color="primary"
                onClick={onAdd}
                sx={{ boxShadow: 1, width: 24, height: 24, minHeight: 24 }}
              >
                <AddOutlinedIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
              </Fab>
            </div>
          </div>
        </div>
        {phases.map((p) => (
          <div
            key={p.id}
            className="relative bg-white"
            style={{ height: TRACK_HEIGHT, marginBottom: LANE_GAP }}
          >
            <div className="flex items-stretch gap-3 h-full">
              <div
                className="flex-none h-full flex items-center"
                style={{ width: LABEL_WIDTH, paddingRight: 8 }}
              >
                <PhaseListItem
                  id={p.id}
                  name={p.name}
                  startDate={p.startDate}
                  endDate={p.endDate}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              </div>
              {calendarStart && calendarEnd && (
                <div className="flex-1 overflow-hidden h-full flex items-stretch">
                  <MiniPhaseTimeline
                    phase={p}
                    calendarStart={calendarStart}
                    calendarEnd={calendarEnd}
                    height={TRACK_HEIGHT}
                    onRangeChange={(s, e) =>
                      onPhaseRangeChange && onPhaseRangeChange(p.id, s, e)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </List>
      <div className="flex items-center justify-end gap-2 mt-3">
        {onAutoGenerate && (
          <Button size="small" variant="text" onClick={onAutoGenerate}>
            Auto
          </Button>
        )}
      </div>
    </div>
  );
}
