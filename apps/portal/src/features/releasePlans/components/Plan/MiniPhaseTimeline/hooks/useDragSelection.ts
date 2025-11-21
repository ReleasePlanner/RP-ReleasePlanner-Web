import { useState, useEffect, useCallback, useRef } from "react";

export type DragState = {
  startIdx: number;
  currentIdx: number;
} | null;

export function useDragSelection(
  totalDays: number,
  pxPerDay: number,
  days: Date[],
  onRangeChange?: (start: string, end: string) => void
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<DragState>(null);

  const clientXToDayIndex = useCallback(
    (clientX: number): number => {
      const el = containerRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left + el.scrollLeft;
      return Math.max(0, Math.min(totalDays - 1, Math.floor(x / pxPerDay)));
    },
    [pxPerDay, totalDays]
  );

  useEffect(() => {
    if (!drag) return;

    const handleMouseMove = (e: MouseEvent) => {
      setDrag((d) =>
        d ? { ...d, currentIdx: clientXToDayIndex(e.clientX) } : d
      );
    };

    const handleMouseUp = () => {
      setDrag((d) => {
        if (d && onRangeChange) {
          const sIdx = Math.min(d.startIdx, d.currentIdx);
          const eIdx = Math.max(d.startIdx, d.currentIdx);
          const startDate = days[sIdx]?.toISOString().slice(0, 10);
          const endDate = days[eIdx]?.toISOString().slice(0, 10);
          if (startDate && endDate) {
            onRangeChange(startDate, endDate);
          }
        }
        return null;
      });
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    globalThis.addEventListener("mouseup", handleMouseUp);

    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drag, clientXToDayIndex, days, onRangeChange]);

  const startDrag = useCallback(
    (clientX: number) => {
      const idx = clientXToDayIndex(clientX);
      setDrag({ startIdx: idx, currentIdx: idx });
    },
    [clientXToDayIndex]
  );

  return {
    containerRef,
    drag,
    startDrag,
    clientXToDayIndex,
  };
}

