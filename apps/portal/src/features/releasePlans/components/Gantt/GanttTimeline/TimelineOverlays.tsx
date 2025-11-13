import { getTimelineColors, TIMELINE_POSITIONS } from "./constants";
import { useTheme, alpha, Chip, IconButton, Tooltip } from "@mui/material";
import { Today as TodayIcon } from "@mui/icons-material";

export type TodayMarkerProps = {
  todayIndex: number;
  pxPerDay: number;
  totalHeight: number;
};

export function TodayMarker({
  todayIndex,
  pxPerDay,
  totalHeight,
}: TodayMarkerProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  
  return (
    <div
      className="absolute top-0"
      style={{
        left: todayIndex * pxPerDay,
        width: 0,
        height: totalHeight,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <div
        className="h-full"
        style={{ 
          borderLeft: `2px solid ${colors.TODAY_MARKER}`,
          boxShadow: `0 0 4px ${alpha(colors.TODAY_MARKER, 0.3)}`,
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: TIMELINE_POSITIONS.TODAY_LABEL.top }}
      >
        <Chip
          label="Today"
          size="small"
          icon={<TodayIcon sx={{ fontSize: 12 }} />}
          sx={{
            height: 20,
            fontSize: "0.7rem",
            fontWeight: 600,
            backgroundColor: colors.BUTTON_BG,
            borderColor: colors.BORDER,
            color: colors.BUTTON_TEXT,
            border: `1px solid ${colors.BORDER}`,
            "& .MuiChip-icon": {
              color: colors.BUTTON_TEXT,
              marginLeft: "4px",
            },
            boxShadow: theme.palette.mode === "dark"
              ? `0 2px 4px ${alpha(theme.palette.common.black, 0.3)}`
              : `0 1px 3px ${alpha(theme.palette.common.black, 0.15)}`,
          }}
        />
      </div>
    </div>
  );
}

export type TodayButtonProps = {
  onJumpToToday: () => void;
};

export function TodayButton({ onJumpToToday }: TodayButtonProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  
  return (
    <div
      className="absolute"
      style={{
        top: TIMELINE_POSITIONS.TODAY_BUTTON.top,
        right: TIMELINE_POSITIONS.TODAY_BUTTON.right,
        zIndex: 10,
      }}
    >
      <Tooltip title="Ir a hoy" arrow placement="left">
        <IconButton
          aria-label="Jump to today"
          onClick={onJumpToToday}
          size="small"
          sx={{
            backgroundColor: colors.BUTTON_BG,
            color: colors.BUTTON_TEXT,
            border: `1px solid ${colors.BORDER}`,
            width: 32,
            height: 28,
            "&:hover": {
              backgroundColor: colors.BUTTON_BG_HOVER,
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease",
            boxShadow: theme.palette.mode === "dark"
              ? `0 2px 4px ${alpha(theme.palette.common.black, 0.3)}`
              : `0 1px 3px ${alpha(theme.palette.common.black, 0.15)}`,
          }}
        >
          <TodayIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export function TimelineLegend() {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  
  return (
    <div
      className="absolute"
      style={{
        top: TIMELINE_POSITIONS.LEGEND.top,
        right: TIMELINE_POSITIONS.LEGEND.right,
        zIndex: 10,
      }}
    >
      <div 
        className="flex items-center gap-2.5 text-[10px] rounded-md border px-2.5 py-1.5"
        style={{
          backgroundColor: colors.BACKGROUND_OVERLAY,
          borderColor: colors.BORDER,
          color: colors.TEXT_SECONDARY,
          backdropFilter: "blur(8px)",
          boxShadow: theme.palette.mode === "dark"
            ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`
            : `0 1px 4px ${alpha(theme.palette.common.black, 0.1)}`,
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm border"
            style={{
              backgroundColor: colors.WEEKEND_BG,
              borderColor: colors.WEEKEND_BORDER,
            }}
          />
          <span style={{ fontWeight: 500 }}>Weekend</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3"
            style={{
              width: 0,
              borderLeft: `2px solid ${colors.TODAY_MARKER}`,
            }}
          />
          <span style={{ fontWeight: 500 }}>Today</span>
        </div>
      </div>
    </div>
  );
}
