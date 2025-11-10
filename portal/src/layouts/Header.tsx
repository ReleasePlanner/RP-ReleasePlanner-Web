import { AppBar, Toolbar, useTheme } from "@mui/material";
import { HeaderNavButton, HeaderTitle, HeaderActions } from "./components";

/**
 * Header Component
 *
 * Main application header with navigation and actions.
 * Displays app title, navigation controls, and action buttons.
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
      sx={{
        boxShadow: theme.shadows[4],
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <HeaderNavButton />
        <HeaderTitle />
        <HeaderActions />
      </Toolbar>
    </AppBar>
  );
}
