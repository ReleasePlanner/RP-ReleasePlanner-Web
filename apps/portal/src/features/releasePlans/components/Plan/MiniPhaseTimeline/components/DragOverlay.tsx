import { memo, useCallback } from "react";
import type { DragState } from "../hooks/useDragSelection";

export type DragOverlayProps = {
  width: number;
  height: number;
  totalDays: number;
  pxPerDay: number;
  onStartDrag: (clientX: number) => void;
};

export const DragOverlay = memo(function DragOverlay({
  width,
  height,
  totalDays,
  pxPerDay,
  onStartDrag,
}: DragOverlayProps) {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onStartDrag(e.clientX);
    },
    [onStartDrag]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const idx = Math.floor(width / 2 / pxPerDay);
        // Trigger drag at center position
        const centerX = width / 2;
        onStartDrag(centerX);
      }
    },
    [width, pxPerDay, onStartDrag]
  );

  return (
    <button
      type="button"
      aria-label="Phase date range selector - Click and drag to select date range"
      className="absolute z-10 border-0 p-0 bg-transparent"
      style={{
        left: 0,
        top: 0,
        width,
        height,
        cursor: "crosshair",
      }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    />
  );
});

