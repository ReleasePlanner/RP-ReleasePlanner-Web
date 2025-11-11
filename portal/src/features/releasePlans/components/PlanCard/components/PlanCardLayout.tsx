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
  onNameChange?: (name: string) => void;
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
  onNameChange,
  left,
  right,
}: PlanCardLayoutProps) {
  return (
    <Card
      variant="elevation"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        boxShadow:
          "0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.02)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.02)",
        },
      }}
    >
      <PlanHeader
        id={plan.metadata.id}
        name={plan.metadata.name}
        expanded={expanded}
        onToggleExpanded={onToggleExpanded}
        onNameChange={onNameChange}
      />

      <Divider sx={{ borderColor: "rgba(0,0,0,0.06)" }} />

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
