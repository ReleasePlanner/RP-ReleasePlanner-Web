import { useState, useEffect, useCallback, type RefObject } from "react";
import { PX_PER_DAY } from "../Gantt/constants";

type DragState = {
  phaseId: string;
  phaseIdx: number;
  startIdx: number;
  currentIdx: number;
} | null;

type EditDragState = {
  phaseId: string;
  phaseIdx: number;
  mode: "move" | "resize-left" | "resize-right";
  anchorIdx: number;
  currentIdx: number;
  originalStartIdx: number;
  originalLen: number;
} | null;

type UseGanttDragAndDropProps = {
  days: Date[];
  onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  containerRef: RefObject<HTMLDivElement>;
  contentRef: RefObject<HTMLDivElement>;
};

export function useGanttDragAndDrop({
  days,
  onPhaseRangeChange,
  containerRef,
  contentRef,
}: UseGanttDragAndDropProps) {
  const [drag, setDrag] = useState<DragState>(null);
  const [editDrag, setEditDrag] = useState<EditDragState>(null);

  const clientXToDayIndex = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return 0;
      const contentLeft = content.getBoundingClientRect().left;
      const x = clientX - contentLeft;
      const idx = Math.floor(x / PX_PER_DAY);
      return Math.max(0, Math.min(days.length - 1, idx));
    },
    [days.length, containerRef, contentRef]
  );

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const idx = clientXToDayIndex(e.clientX);
      if (drag) {
        setDrag((d) => (d ? { ...d, currentIdx: idx } : d));
      }
      if (editDrag) {
        setEditDrag((d) => (d ? { ...d, currentIdx: idx } : d));
      }
    }

    function onUp() {
      if (drag) {
        const a = Math.min(drag.startIdx, drag.currentIdx);
        const b = Math.max(drag.startIdx, drag.currentIdx);
        const s = days[a].toISOString().slice(0, 10);
        const e = days[b].toISOString().slice(0, 10);
        if (onPhaseRangeChange) {
          onPhaseRangeChange(drag.phaseId, s, e);
        }
      }
      if (editDrag) {
        const {
          mode,
          anchorIdx,
          currentIdx,
          originalStartIdx,
          originalLen,
          phaseId,
        } = editDrag;
        let newStartIdx = originalStartIdx;
        let newLen = originalLen;
        if (mode === "move") {
          const delta = currentIdx - anchorIdx;
          newStartIdx = Math.max(
            0,
            Math.min(days.length - originalLen, originalStartIdx + delta)
          );
          newLen = originalLen;
        } else if (mode === "resize-left") {
          newStartIdx = Math.max(
            0,
            Math.min(originalStartIdx + originalLen - 1, currentIdx)
          );
          newLen = Math.max(1, originalStartIdx + originalLen - newStartIdx);
        } else if (mode === "resize-right") {
          const proposedEnd = Math.max(originalStartIdx + 1, currentIdx);
          newLen = Math.max(
            1,
            Math.min(
              days.length - originalStartIdx,
              proposedEnd - originalStartIdx
            )
          );
        }
        const clampedStart = Math.max(
          0,
          Math.min(days.length - 1, newStartIdx)
        );
        const clampedEndIndex = Math.max(
          clampedStart,
          Math.min(days.length - 1, clampedStart + newLen)
        );
        const s = days[clampedStart]?.toISOString().slice(0, 10);
        const e = days[clampedEndIndex]?.toISOString().slice(0, 10);
        if (s && e && onPhaseRangeChange) onPhaseRangeChange(phaseId, s, e);
      }
      setDrag(null);
      setEditDrag(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, editDrag, days, onPhaseRangeChange, clientXToDayIndex]);

  return { drag, editDrag, setDrag, setEditDrag, clientXToDayIndex };
}
