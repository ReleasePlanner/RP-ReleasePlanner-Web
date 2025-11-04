import { TIMELINE_COLORS, TIMELINE_POSITIONS } from "./constants";

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
  return (
    <div
      className="absolute top-0"
      style={{
        left: todayIndex * pxPerDay,
        width: 0,
        height: totalHeight,
        pointerEvents: "none",
      }}
    >
      <div
        className="h-full"
        style={{ borderLeft: `2px solid ${TIMELINE_COLORS.TODAY_MARKER}` }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: TIMELINE_POSITIONS.TODAY_LABEL.top }}
      >
        <span
          aria-hidden="true"
          className="text-[10px] px-1 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-700"
        >
          Today
        </span>
      </div>
    </div>
  );
}

export type TodayButtonProps = {
  onJumpToToday: () => void;
};

export function TodayButton({ onJumpToToday }: TodayButtonProps) {
  return (
    <div
      className="absolute"
      style={{
        top: TIMELINE_POSITIONS.TODAY_BUTTON.top,
        right: TIMELINE_POSITIONS.TODAY_BUTTON.right,
      }}
    >
      <button
        aria-label="Jump to today"
        className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={onJumpToToday}
        type="button"
      >
        Today
      </button>
    </div>
  );
}

export function TimelineLegend() {
  return (
    <div
      className="absolute"
      style={{
        top: TIMELINE_POSITIONS.LEGEND.top,
        right: TIMELINE_POSITIONS.LEGEND.right,
      }}
    >
      <div className="flex items-center gap-3 text-[10px] text-gray-600 bg-white/80 rounded border border-gray-200 px-2 py-1">
        <div className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm border"
            style={{
              backgroundColor: TIMELINE_COLORS.WEEKEND_BG,
              borderColor: TIMELINE_COLORS.WEEKEND_BORDER,
            }}
          />
          <span>Weekend</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="inline-block h-3"
            style={{
              width: 0,
              borderLeft: `2px dashed ${TIMELINE_COLORS.TODAY_MARKER}`,
            }}
          />
          <span>Current day</span>
        </div>
      </div>
    </div>
  );
}
