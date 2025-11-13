import { Card, CardContent, Collapse, Divider, useTheme, alpha } from "@mui/material";
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
 * Responsive and elegant Material UI design
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
  const theme = useTheme();
  
  return (
    <Card
      variant="elevation"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: theme.palette.mode === "dark"
          ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}, 0 1px 3px ${alpha(theme.palette.common.black, 0.2)}`
          : "0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          boxShadow: theme.palette.mode === "dark"
            ? `0 4px 16px ${alpha(theme.palette.common.black, 0.4)}, 0 2px 6px ${alpha(theme.palette.common.black, 0.3)}`
            : "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
          transform: "translateY(-1px)",
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

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <Collapse in={expanded} timeout={200} unmountOnExit>
        <CardContent
          sx={{
            p: 0,
            height: { xs: "500px", sm: "600px", md: "700px" },
            minHeight: { xs: "400px", sm: "500px" },
            maxHeight: { xs: "600px", sm: "800px", md: "900px" },
            display: "flex",
            flexDirection: "column",
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
