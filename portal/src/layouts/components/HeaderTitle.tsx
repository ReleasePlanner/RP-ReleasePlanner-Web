/**
 * Header Title Component
 *
 * Displays the application title/branding in the header with elegant, minimalist design.
 * Features:
 * - Clean typography hierarchy
 * - Responsive font sizing
 * - Smooth transitions
 * - Centered positioning
 */

import { Typography, useTheme, useMediaQuery, Box } from "@mui/material";

/**
 * HeaderTitle Component
 *
 * Renders the main application title with:
 * - Clean, modern typography
 * - Responsive font sizing (xs: 1.0rem, sm: 1.125rem, md: 1.25rem)
 * - Centered layout
 * - Subtle letter spacing for elegance
 * - Theme color integration
 *
 * @example
 * ```tsx
 * <HeaderTitle />
 * ```
 */
export function HeaderTitle() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h6"
        component="h1"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
          lineHeight: 1.2,
          color: theme.palette.common.white,
          letterSpacing: "-0.015em",
          transition: theme.transitions.create(["font-size", "font-weight"], {
            duration: theme.transitions.duration.shorter,
          }),
          // Subtle gradient text effect (optional premium touch)
          background: isMobile
            ? "transparent"
            : `linear-gradient(135deg, ${theme.palette.common.white}, ${theme.palette.common.white}dd)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: isMobile ? "inherit" : "transparent",
        }}
      >
        Release Planner
      </Typography>
    </Box>
  );
}
