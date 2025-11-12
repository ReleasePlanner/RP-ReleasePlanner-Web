import Tooltip from "@mui/material/Tooltip";
import type { ReactNode } from "react";

type PhaseBarProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  label?: string;
  title?: string;
  ariaLabel?: string;
  tooltipContent?: ReactNode;
  onStartMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onStartResizeLeft?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onStartResizeRight?: (e: React.MouseEvent<HTMLDivElement>) => void;
  testIdSuffix?: string;
  onDoubleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function PhaseBar({
  left,
  top,
  width,
  height,
  color,
  label,
  title,
  ariaLabel,
  tooltipContent,
  onStartMove,
  onStartResizeLeft,
  onStartResizeRight,
  testIdSuffix,
  onDoubleClick,
}: PhaseBarProps) {
  return (
    <Tooltip title={tooltipContent ?? title ?? ""} placement="top" arrow>
      <div
        className="absolute"
        style={{ left, top, width, height }}
        aria-label={ariaLabel}
        onDoubleClick={onDoubleClick}
      >
        <div
          className="h-full rounded-md opacity-75 shadow-sm"
          style={{ backgroundColor: color }}
        />
        {label && (
          <div className="absolute left-1 top-1 text-[11px] text-white/95 font-medium mix-blend-luminosity truncate pr-1">
            {label}
          </div>
        )}
        <div
          data-testid={
            testIdSuffix ? `phasebar-resize-left-${testIdSuffix}` : undefined
          }
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: 6,
            height: "100%",
            cursor: "ew-resize",
          }}
          onMouseDown={onStartResizeLeft}
        />
        <div
          data-testid={
            testIdSuffix ? `phasebar-move-${testIdSuffix}` : undefined
          }
          className="absolute"
          style={{ left: 6, right: 6, top: 0, height: "100%", cursor: "grab" }}
          onMouseDown={onStartMove}
          onDoubleClick={onDoubleClick}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.detail >= 2 && onDoubleClick) onDoubleClick(e);
          }}
        />
        <div
          data-testid={
            testIdSuffix ? `phasebar-resize-right-${testIdSuffix}` : undefined
          }
          className="absolute"
          style={{
            right: 0,
            top: 0,
            width: 6,
            height: "100%",
            cursor: "ew-resize",
          }}
          onMouseDown={onStartResizeRight}
        />
      </div>
    </Tooltip>
  );
}
