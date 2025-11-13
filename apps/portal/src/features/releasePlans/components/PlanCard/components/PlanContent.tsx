import ResizableSplit from "../../Plan/ResizableSplit/ResizableSplit";

export type PlanContentProps = {
  leftPercent: number;
  onLeftPercentChange: (percent: number) => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

/**
 * Content area with resizable split layout
 * Manages the left/right pane sizing
 */
export function PlanContent({
  leftPercent,
  onLeftPercentChange,
  left,
  right,
}: PlanContentProps) {
  return (
    <ResizableSplit
      leftPercent={leftPercent}
      onLeftPercentChange={onLeftPercentChange}
      left={left}
      right={right}
    />
  );
}
