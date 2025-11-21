import { useRef } from "react";
import { useResizeDrag, useResizeCollapse, useResizeKeyboard } from "./hooks";
import { ResizePanel, ResizeSeparator } from "./components";

export type ResizableSplitProps = {
  readonly leftPercent: number; // 0-100
  readonly onLeftPercentChange: (v: number) => void;
  readonly left: React.ReactNode;
  readonly right: React.ReactNode;
};

export default function ResizableSplit({
  leftPercent,
  onLeftPercentChange,
  left,
  right,
}: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hooks for resize functionality
  const { onMouseDown } = useResizeDrag(containerRef, onLeftPercentChange);
  const { onDoubleClick } = useResizeCollapse(leftPercent, onLeftPercentChange);
  const { onKeyDown } = useResizeKeyboard(leftPercent, onLeftPercentChange);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        gap: "8px",
        minHeight: 0,
      }}
    >
      {leftPercent > 0 && (
        <ResizePanel width={`${leftPercent}%`}>{left}</ResizePanel>
      )}

      <ResizeSeparator
        leftPercent={leftPercent}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
      />

      <ResizePanel width={`${100 - leftPercent}%`}>{right}</ResizePanel>
    </div>
  );
}
