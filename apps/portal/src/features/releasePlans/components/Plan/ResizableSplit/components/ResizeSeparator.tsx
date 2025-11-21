import { useState } from "react";

export type ResizeSeparatorProps = {
  readonly leftPercent: number;
  readonly onMouseDown: (e: React.MouseEvent) => void;
  readonly onDoubleClick: () => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;
};

export function ResizeSeparator({
  leftPercent,
  onMouseDown,
  onDoubleClick,
  onKeyDown,
}: ResizeSeparatorProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      role="separator"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(leftPercent)}
      aria-label="Resize panels"
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Drag to resize or double-click to collapse/expand"
      style={{
        width: "4px",
        cursor: "col-resize",
        backgroundColor: isHovered ? "#bdbdbd" : "#e0e0e0",
        borderRadius: "2px",
        flexShrink: 0,
        transition: "background-color 0.2s",
        border: "none",
        padding: 0,
        outline: "none",
      }}
    />
  );
}

