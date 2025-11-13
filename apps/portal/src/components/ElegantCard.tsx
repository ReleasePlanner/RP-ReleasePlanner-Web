/**
 * ElegantCard Component
 *
 * Reusable card component with consistent Material UI styling
 */

import {
  Card as MuiCard,
  useTheme,
  alpha,
  type SxProps,
  type Theme,
} from "@mui/material";
import type { ReactNode } from "react";

interface ElegantCardProps {
  /**
   * Card content
   */
  children: ReactNode;
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Hover effect enabled
   */
  hover?: boolean;
}

/**
 * ElegantCard Component
 *
 * Beautiful, consistent card design:
 * - Subtle border with no elevation
 * - Smooth hover effects
 * - Material UI compliant
 * - Responsive and accessible
 *
 * @example
 * ```tsx
 * <ElegantCard hover>
 *   <CardContent>Content here</CardContent>
 * </ElegantCard>
 * ```
 */
export function ElegantCard({
  children,
  sx,
  onClick,
  hover = true,
}: ElegantCardProps) {
  const theme = useTheme();

  return (
    <MuiCard
      elevation={0}
      onClick={onClick}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: theme.transitions.create(
          ["border-color", "box-shadow", "transform"],
          {
            duration: theme.transitions.duration.shorter,
          }
        ),
        cursor: onClick ? "pointer" : "default",
        ...(hover && {
          "&:hover": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
            transform: "translateY(-2px)",
          },
        }),
        ...sx,
      }}
    >
      {children}
    </MuiCard>
  );
}
