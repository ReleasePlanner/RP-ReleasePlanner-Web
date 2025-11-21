import { useEffect, useRef, useCallback } from "react";

export function useResizeDrag(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onLeftPercentChange: (percent: number) => void
) {
  const draggingRef = useRef<boolean>(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
  }, []);

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

    globalThis.addEventListener("mousemove", onMove);
    globalThis.addEventListener("mouseup", onUp);

    return () => {
      globalThis.removeEventListener("mousemove", onMove);
      globalThis.removeEventListener("mouseup", onUp);
    };
  }, [containerRef, onLeftPercentChange]);

  return { onMouseDown };
}

