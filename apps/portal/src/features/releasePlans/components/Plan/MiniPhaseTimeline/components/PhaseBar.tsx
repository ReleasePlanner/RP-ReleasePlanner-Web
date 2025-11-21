import { memo } from "react";

export type PhaseBarProps = {
  left: number;
  width: number;
  height: number;
  color: string;
};

export const PhaseBar = memo(function PhaseBar({
  left,
  width,
  height,
  color,
}: PhaseBarProps) {
  return (
    <div
      className="absolute"
      style={{ left, top: 0, width, height }}
    >
      <div
        className="h-full rounded"
        style={{ backgroundColor: color }}
      />
    </div>
  );
});

