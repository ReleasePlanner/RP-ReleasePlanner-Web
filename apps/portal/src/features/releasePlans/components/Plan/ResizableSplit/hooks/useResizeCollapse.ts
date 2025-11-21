import { useState, useCallback } from "react";

export function useResizeCollapse(
  leftPercent: number,
  onLeftPercentChange: (percent: number) => void
) {
  const [previousPercent, setPreviousPercent] = useState<number | null>(null);

  const onDoubleClick = useCallback(() => {
    // Toggle between collapsed (0%) and previous size or default 50%
    if (leftPercent <= 5) {
      // Currently collapsed, restore to previous size or default 50%
      const targetPercent = previousPercent ?? 50;
      onLeftPercentChange(targetPercent);
      setPreviousPercent(null);
    } else {
      // Currently visible, collapse to 0% (hide left panel completely)
      setPreviousPercent(leftPercent);
      onLeftPercentChange(0);
    }
  }, [leftPercent, previousPercent, onLeftPercentChange]);

  return { onDoubleClick };
}

