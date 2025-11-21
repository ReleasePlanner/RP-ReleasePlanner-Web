import { useCallback } from "react";

export function useResizeKeyboard(
  leftPercent: number,
  onLeftPercentChange: (percent: number) => void
) {
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

  return { onKeyDown };
}

