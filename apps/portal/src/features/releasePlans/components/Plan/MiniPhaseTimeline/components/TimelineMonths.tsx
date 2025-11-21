import { memo } from "react";

export type TimelineMonthsProps = {
  segments: Array<{ label: string; startIndex: number; length: number }>;
  pxPerDay: number;
  height: number;
  textColor: string;
  borderColor: string;
};

export const TimelineMonths = memo(function TimelineMonths({
  segments,
  pxPerDay,
  height,
  textColor,
  borderColor,
}: TimelineMonthsProps) {
  return (
    <div className="relative" style={{ height }}>
      {segments.map((m) => (
        <div
          key={`month-${m.startIndex}-${m.length}-${m.label}`}
          className="absolute top-0 text-[10px] flex items-center justify-center border-r"
          style={{
            left: m.startIndex * pxPerDay,
            width: m.length * pxPerDay,
            height,
            color: textColor,
            borderColor,
          }}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
});

