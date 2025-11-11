import { Card, CardContent, Collapse, Divider } from "@mui/material";
import type { Plan } from "../../../types";
import { PlanHeader } from "./PlanHeader";
import { PlanContent } from "./PlanContent";

export type PlanCardLayoutProps = {
  plan: Plan;
  expanded: boolean;
  leftPercent: number;
  onToggleExpanded: () => void;
  onLeftPercentChange: (percent: number) => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

/**
 * Layout component for PlanCard
 * Follows SRP - only handles layout and expansion state
 */
export function PlanCardLayout({
  plan,
  expanded,
  leftPercent,
  onToggleExpanded,
  onLeftPercentChange,
  left,
  right,
}: PlanCardLayoutProps) {
  return (
    <Card variant="outlined" className="shadow-sm">
      <PlanHeader
        id={plan.metadata.id}
        name={plan.metadata.name}
        status={plan.metadata.status}
        startDate={plan.metadata.startDate}
        endDate={plan.metadata.endDate}
        productId={plan.metadata.productId}
        itOwner={plan.metadata.itOwner}
        description={plan.metadata.description}
        expanded={expanded}
        onToggleExpanded={onToggleExpanded}
      />

      <Divider />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            p: 0,
            height: "600px",
            minHeight: "400px",
            maxHeight: "800px",
            "&:last-child": {
              pb: 0,
            },
          }}
        >
          <PlanContent
            leftPercent={leftPercent}
            onLeftPercentChange={onLeftPercentChange}
            left={left}
            right={right}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
}
