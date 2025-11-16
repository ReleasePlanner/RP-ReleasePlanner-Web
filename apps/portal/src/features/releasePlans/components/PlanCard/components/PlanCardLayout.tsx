import { useState, useEffect, useRef } from "react";
import { Card, CardContent, Collapse, Divider, useTheme, alpha, Box, LinearProgress, Typography } from "@mui/material";
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
 * Responsive and elegant Material UI design
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
  const theme = useTheme();
  
  // ⚡ Render content immediately when expanded - no artificial delays
  // Show progress bar while heavy components mount
  // Initialize based on expanded state to avoid rendering issues
  const [isContentReady, setIsContentReady] = useState(expanded);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle expanded state changes - render content immediately
  useEffect(() => {
    if (expanded) {
      // Clear any pending timeouts
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
        renderTimeoutRef.current = null;
      }
      
      // If not ready yet, render immediately
      if (!isContentReady) {
        // Use requestAnimationFrame to avoid blocking but render ASAP
        if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
          requestAnimationFrame(() => {
            setIsContentReady(true);
          });
        } else {
          setIsContentReady(true);
        }
      }
    } else {
      // When collapsing, reset state immediately
      setIsContentReady(false);
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
        renderTimeoutRef.current = null;
      }
    }
  }, [expanded, isContentReady]);
  
  // Handle Collapse callbacks - ensure content renders ASAP
  const handleCollapseEnter = () => {
    // Render immediately when animation starts
    setIsContentReady(true);
  };
  
  const handleCollapseEntered = () => {
    // Ensure content is definitely rendered (safety net)
    setIsContentReady(true);
  };
  
  const handleCollapseExit = () => {
    // Reset state when collapsing
    setIsContentReady(false);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);
  
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
      />

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <Collapse 
        in={expanded} 
        timeout={150}
        unmountOnExit
        onEnter={handleCollapseEnter}
        onEntered={handleCollapseEntered}
        onExit={handleCollapseExit}
      >
        <CardContent
          sx={{
            p: 0,
            height: { xs: "500px", sm: "600px", md: "700px" },
            minHeight: { xs: "400px", sm: "500px" },
            maxHeight: { xs: "600px", sm: "800px", md: "900px" },
            display: "flex",
            flexDirection: "column",
            position: "relative",
            "&:last-child": {
              pb: 0,
            },
          }}
        >
          {/* ⚡ Show prominent progress bar while content is loading */}
          {!isContentReady ? (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.default, 0.95)
                  : alpha(theme.palette.background.default, 0.98),
                zIndex: 10,
                gap: 2,
              }}
            >
              <LinearProgress 
                sx={{ 
                  width: "80%", 
                  maxWidth: 400,
                  height: 6,
                  borderRadius: 3,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                  }
                }} 
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                Cargando plan...
              </Typography>
            </Box>
          ) : (
            /* ⚡ Render content immediately - no artificial delays */
            <PlanContent
              leftPercent={leftPercent}
              onLeftPercentChange={onLeftPercentChange}
              left={left}
              right={right}
            />
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
