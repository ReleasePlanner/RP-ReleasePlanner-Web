type GanttLaneProps = {
  top: number;
  height: number;
  index: number;
};

export default function GanttLane({ top, height, index }: GanttLaneProps) {
  const background = index % 2 === 0 ? 'rgba(0,0,0,0.015)' : 'rgba(0,0,0,0.03)';
  return (
    <div
      className="absolute left-0 right-0"
      aria-hidden
      style={{
        top,
        height,
        background,
        borderTop: '1px solid rgba(0,0,0,0.06)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    />
  );
}


