import { AppBar, Toolbar, useTheme, Box } from "@mui/material";
import { HeaderNavButton, HeaderTitle, HeaderActions } from "./components";

/**
 * Header Component
 *
 * Main application header with elegant, minimalist design.
 * Features:
 * - Clean typography hierarchy
 * - Optimized spacing for all breakpoints
 * - Material UI 7 compliant
 * - Subtle elevation and shadow
 * - Responsive layout
 *
 * Composed of:
 * - HeaderNavButton: Toggle left sidebar
 * - HeaderTitle: App branding
 * - HeaderActions: Add release button and right sidebar toggle
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header() {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      color="primary"
      enableColorOnDark
      elevation={1}
      sx={{
        boxShadow: theme.shadows[2],
        transition: theme.transitions.create(["box-shadow"], {
          duration: theme.transitions.duration.shorter,
        }),
        // Subtle shadow increase on scroll (can be enhanced with scroll listener)
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 1, sm: 2, md: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Left Section - Navigation Toggle */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <HeaderNavButton />
        </Box>

        {/* Spacer - expands to push everything else to the right */}
        <Box sx={{ flex: 1 }} />

        {/* Center Section - Title */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <HeaderTitle />
        </Box>

        {/* Another Spacer to push actions to far right */}
        <Box sx={{ flex: 1 }} />

        {/* Right Section - Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <HeaderActions />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
