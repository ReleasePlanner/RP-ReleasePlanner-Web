import { memo } from "react";
import { useTheme, alpha } from "@mui/material";
import type { DragState } from "../hooks/useDragSelection";

export type DragSelectionProps = {
  drag: DragState;
  pxPerDay: number;
  height: number;
};

export const DragSelection = memo(function DragSelection({
  drag,
  pxPerDay,
  height,
}: DragSelectionProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!drag) return null;

  const left = Math.min(drag.startIdx, drag.currentIdx) * pxPerDay;
  const width = (Math.abs(drag.currentIdx - drag.startIdx) + 1) * pxPerDay;

  return (
    <div
      className="absolute z-20 border"
      style={{
        left,
        width,
        top: 0,
        height,
        pointerEvents: "none",
        backgroundColor: isDark
          ? alpha(theme.palette.primary.main, 0.2)
          : alpha(theme.palette.primary.main, 0.1),
        borderColor: theme.palette.primary.main,
      }}
    />
  );
});

