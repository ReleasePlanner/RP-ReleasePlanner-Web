/**
 * Layout Footer Component
 *
 * Displays footer section with copyright and navigation links.
 * Used at the bottom of MainLayout.
 */

import { useMemo } from "react";
import { Box, Container, Link, Typography, useTheme } from "@mui/material";

/**
 * LayoutFooter Component
 *
 * Renders the application footer with:
 * - Copyright information (dynamic year)
 * - Back to top navigation link
 * - Responsive padding and styling
 * - Theme-aware colors and borders
 *
 * @example
 * ```tsx
 * <LayoutFooter />
 * ```
 */
export function LayoutFooter() {
  const theme = useTheme();
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 1.5, md: 2 },
          px: { xs: 1.5, sm: 2, md: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.875rem",
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "inherit" }}>
          © {year} Release Planner
        </Typography>
        <Link
          href="#top"
          underline="none"
          sx={{
            fontSize: "inherit",
            color: theme.palette.text.secondary,
            transition: theme.transitions.create(["color"]),
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          Back to top
        </Link>
      </Container>
    </Box>
  );
}
