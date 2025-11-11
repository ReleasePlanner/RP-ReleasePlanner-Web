import { useCallback, useEffect, useRef, useState } from "react";

export type ResizableSplitProps = {
  leftPercent: number; // 0-100
  onLeftPercentChange: (v: number) => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

export default function ResizableSplit({
  leftPercent,
  onLeftPercentChange,
  left,
  right,
}: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<boolean>(false);
  const [previousPercent, setPreviousPercent] = useState<number | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
  }, []);

  // Handle double click to collapse/expand
  const onDoubleClick = useCallback(() => {
    // Toggle between collapsed (0%) and previous size or default 50%
    if (leftPercent <= 5) {
      // Currently collapsed, restore to previous size or default 50%
      const targetPercent = previousPercent !== null ? previousPercent : 50;
      onLeftPercentChange(targetPercent);
      setPreviousPercent(null);
    } else {
      // Currently visible, collapse to 0% (hide left panel completely)
      setPreviousPercent(leftPercent);
      onLeftPercentChange(0);
    }
  }, [leftPercent, previousPercent, onLeftPercentChange]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;
      const clamped = Math.max(0, Math.min(100, percent));
      onLeftPercentChange(clamped);
    }
    function onUp() {
      draggingRef.current = false;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onLeftPercentChange]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onLeftPercentChange(Math.max(0, leftPercent - 2));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onLeftPercentChange(Math.min(100, leftPercent + 2));
      }
    },
    [leftPercent, onLeftPercentChange]
  );

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
        <div
          style={{
            width: `${leftPercent}%`,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {left}
        </div>
      )}
      <div
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(leftPercent)}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        style={{
          width: "4px",
          cursor: "col-resize",
          backgroundColor: "#e0e0e0",
          borderRadius: "2px",
          flexShrink: 0,
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#bdbdbd";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#e0e0e0";
        }}
        title="Drag to resize or double-click to collapse/expand"
      />
      <div
        style={{
          width: `${100 - leftPercent}%`,
          minWidth: 0,
          overflow: "auto",
        }}
      >
        {right}
      </div>
    </div>
  );
}
