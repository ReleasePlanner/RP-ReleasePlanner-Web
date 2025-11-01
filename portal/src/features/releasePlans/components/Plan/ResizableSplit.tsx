import { useCallback, useEffect, useRef } from 'react';

export type ResizableSplitProps = {
  leftPercent: number; // 0-100
  onLeftPercentChange: (v: number) => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

export default function ResizableSplit({ leftPercent, onLeftPercentChange, left, right }: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
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
      const clamped = Math.max(20, Math.min(80, percent));
      onLeftPercentChange(clamped);
    }
    function onUp() {
      draggingRef.current = false;
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [onLeftPercentChange]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onLeftPercentChange(Math.max(20, leftPercent - 2));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onLeftPercentChange(Math.min(80, leftPercent + 2));
    }
  }, [leftPercent, onLeftPercentChange]);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:flex gap-4 items-start">
      <div className="space-y-3 md:shrink-0" style={{ flexBasis: `${leftPercent}%` }}>{left}</div>
      <div
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        aria-valuemin={20}
        aria-valuemax={80}
        aria-valuenow={Math.round(leftPercent)}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        className="hidden md:block w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 rounded select-none"
        style={{ height: '100%', minHeight: 120 }}
        title="Drag to resize"
      />
      <div className="min-w-0" style={{ flexBasis: `${100 - leftPercent}%` }}>{right}</div>
    </div>
  );
}
