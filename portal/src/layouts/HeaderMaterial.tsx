/**
 * Material Design Header Component
 *
 * Main application header with minimalista design principles.
 * Composes action buttons, title, and navigation toggle.
 */

import { AppBar, Toolbar, alpha, useTheme } from "@mui/material";
import { HeaderNavButton, HeaderTitle, HeaderActions } from "./components";

/**
 * HeaderMaterial Component
 *
 * Renders the application header with:
 * - Sticky positioning
 * - Responsive toolbar
 * - Navigation, title, and action buttons
 * - Theme-aware styling with subtle border
 * - Minimalista design philosophy
 *
 * @example
 * ```tsx
 * <HeaderMaterial />
 * ```
 */
export function HeaderMaterial() {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.primary.main,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { xs: 56, md: 64 },
          px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          position: "relative",
        }}
      >
        {/* Left Section - Navigation Toggle */}
        <div
          style={{
            position: "absolute",
            left: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <HeaderNavButton />
        </div>

        {/* Center Section - Title */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <HeaderTitle />
        </div>

        {/* Right Section - Actions */}
        <div
          style={{
            position: "absolute",
            right: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <HeaderActions />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default HeaderMaterial;
