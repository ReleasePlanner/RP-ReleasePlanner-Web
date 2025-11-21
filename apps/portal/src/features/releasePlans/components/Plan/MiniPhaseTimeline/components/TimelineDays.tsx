import { memo } from "react";

export type TimelineDaysProps = {
  days: Date[];
  pxPerDay: number;
  height: number;
  textColor: string;
  borderColor: string;
};

export const TimelineDays = memo(function TimelineDays({
  days,
  pxPerDay,
  height,
  textColor,
  borderColor,
}: TimelineDaysProps) {
  return (
    <div className="relative" style={{ height }}>
      {days.map((d, dayIndex) => (
        <div
          key={`day-${d.toISOString().slice(0, 10)}`}
          className="absolute top-0 border-r text-[9px] flex items-center justify-center"
          style={{
            left: dayIndex * pxPerDay,
            width: pxPerDay,
            height,
            color: textColor,
            borderColor,
          }}
          title={d.toISOString().slice(0, 10)}
        >
          {d.getDate()}
        </div>
      ))}
    </div>
  );
});

