import { 
  Button, 
  List, 
  IconButton, 
  Tooltip, 
  useTheme, 
  alpha,
  Box,
  Paper,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
  return (
    <Box sx={{ position: "relative" }}>
      {/* Spacer to align first phase with timeline */}
      <Box
        sx={{
          height: Math.max(
            0,
            (_headerOffsetTopPx ?? 0) - (TRACK_HEIGHT + LANE_GAP)
          ),
        }}
      />
      
      <List 
        dense 
        disablePadding
        sx={{
          "& .MuiListItem-root": {
            minHeight: TRACK_HEIGHT,
            padding: 0,
          },
        }}
      >
        {/* Add button row */}
        <Paper
          elevation={0}
          sx={{
            height: TRACK_HEIGHT,
            marginBottom: `${LANE_GAP}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: 1,
            bgcolor: "transparent",
            borderRadius: 1,
            transition: "background-color 0.2s ease",
            "&:hover": {
              bgcolor: isDark
                ? alpha(theme.palette.action.hover, 0.05)
                : alpha(theme.palette.action.hover, 0.03),
            },
          }}
        >
          <Tooltip title="Agregar fase" arrow placement="left">
            <IconButton
              size="small"
              onClick={onAdd}
              sx={{
                width: 28,
                height: 28,
                bgcolor: isDark
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: isDark
                    ? alpha(theme.palette.primary.main, 0.25)
                    : alpha(theme.palette.primary.main, 0.2),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
                boxShadow: theme.shadows[1],
              }}
            >
              <AddOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Paper>

        {/* Phase items */}
        {phases.map((p, index) => (
          <Paper
            key={p.id}
            elevation={0}
            sx={{
              height: TRACK_HEIGHT,
              marginBottom: index < phases.length - 1 ? `${LANE_GAP}px` : 0,
              display: "flex",
              alignItems: "stretch",
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "transparent",
              border: `1px solid transparent`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isDark
                  ? alpha(theme.palette.action.hover, 0.05)
                  : alpha(theme.palette.action.hover, 0.03),
                borderColor: theme.palette.divider,
                boxShadow: theme.shadows[1],
              },
            }}
          >
            <Box
              sx={{
                width: LABEL_WIDTH,
                pr: 1,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <PhaseListItem
                id={p.id}
                name={p.name}
                startDate={p.startDate}
                endDate={p.endDate}
                color={p.color}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            </Box>
            {calendarStart && calendarEnd && (
              <Box
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "stretch",
                  minWidth: 0,
                }}
              >
                <MiniPhaseTimeline
                  phase={p}
                  calendarStart={calendarStart}
                  calendarEnd={calendarEnd}
                  height={TRACK_HEIGHT}
                  onRangeChange={(s, e) =>
                    onPhaseRangeChange && onPhaseRangeChange(p.id, s, e)
                  }
                />
              </Box>
            )}
          </Paper>
        ))}
      </List>

      {/* Auto generate button */}
      {onAutoGenerate && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
            px: 1,
          }}
        >
          <Tooltip title="Generar fases automáticamente" arrow>
            <Button
              size="small"
              variant="text"
              startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
              onClick={onAutoGenerate}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                color: isDark
                  ? alpha(theme.palette.text.secondary, 0.8)
                  : theme.palette.text.secondary,
                "&:hover": {
                  bgcolor: isDark
                    ? alpha(theme.palette.action.hover, 0.08)
                    : alpha(theme.palette.action.hover, 0.05),
                  color: theme.palette.primary.main,
                },
                transition: "all 0.2s ease",
              }}
            >
              Auto Generate
            </Button>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
