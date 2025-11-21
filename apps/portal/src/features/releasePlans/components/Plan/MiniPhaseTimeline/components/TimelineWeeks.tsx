import { memo } from "react";

export type TimelineWeeksProps = {
  segments: Array<{ label: string; startIndex: number; length: number }>;
  pxPerDay: number;
  height: number;
  textColor: string;
  borderColor: string;
};

export const TimelineWeeks = memo(function TimelineWeeks({
  segments,
  pxPerDay,
  height,
  textColor,
  borderColor,
}: TimelineWeeksProps) {
  return (
    <div className="relative" style={{ height }}>
      {segments.map((w) => (
        <div
          key={`week-${w.startIndex}-${w.length}-${w.label}`}
          className="absolute top-0 text-[9px] flex items-center justify-center border-r"
          style={{
            left: w.startIndex * pxPerDay,
            width: w.length * pxPerDay,
            height,
            color: textColor,
            borderColor,
          }}
        >
          {w.label}
        </div>
      ))}
    </div>
  );
});

