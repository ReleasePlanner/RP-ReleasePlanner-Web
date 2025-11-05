import { GANTT_DIMENSIONS, GANTT_COLORS } from "../../../constants";

export type WeekendShadingProps = {
  days: Date[];
  pxPerDay: number;
  height: number;
};

/**
 * Component for rendering weekend shading across timeline
 * Follows SRP - only responsible for weekend visual indication
 */
export function WeekendShading({
  days,
  pxPerDay,
  height,
}: WeekendShadingProps) {
  return (
    <>
      {days.map((d, i) => {
        const dow = d.getDay();
        return dow === 0 || dow === 6 ? (
          <div
            key={`weekend-${i}`}
            className="absolute top-0 pointer-events-none z-0"
            style={{
              left: i * pxPerDay,
              width: pxPerDay,
              height: height,
              backgroundColor: GANTT_COLORS.WEEKEND_BG,
            }}
          />
        ) : null;
      })}
    </>
  );
}

export type TracksContainerProps = {
  children: React.ReactNode;
  phaseCount: number;
};

/**
 * Container for all phase tracks with proper height calculation
 */
export function TracksContainer({
  children,
  phaseCount,
}: TracksContainerProps) {
  const height =
    phaseCount * (GANTT_DIMENSIONS.TRACK_HEIGHT + GANTT_DIMENSIONS.LANE_GAP) +
    GANTT_DIMENSIONS.LANE_GAP;

  return (
    <div className="relative" style={{ height }}>
      {children}
    </div>
  );
}
