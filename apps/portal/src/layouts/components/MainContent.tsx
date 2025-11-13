/**
 * Main Content Area Component
 *
 * Displays the main content area with responsive spacing.
 * Adjusts margins based on sidebar state.
 */

import type { PropsWithChildren } from "react";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { DRAWER_WIDTH as LEFT_DRAWER_WIDTH } from "./LeftDrawerContent";
import { DRAWER_WIDTH as RIGHT_DRAWER_WIDTH } from "./RightDrawerContent";
import { useAppSelector } from "../../store/hooks";

/**
 * Props for MainContent component
 */
interface MainContentProps extends PropsWithChildren {
  /**
   * Additional content to render.
   * If not provided, renders outlet for React Router.
   */
  children?: React.ReactNode;
}

/**
 * MainContent Component
 *
 * Renders the main content area with:
 * - Responsive left/right margins based on sidebar state
 * - Scrollable content area
 * - Responsive container padding
 * - Proper layout composition
 *
 * @example
 * ```tsx
 * <MainContent>
 *   {children}
 * </MainContent>
 * ```
 */
export function MainContent({ children }: MainContentProps) {
  const leftOpen = useAppSelector((s) => s.ui.leftSidebarOpen);
  const rightOpen = useAppSelector((s) => s.ui.rightSidebarOpen);

  return (
    <Box
      component="main"
      sx={{
        ml: { md: leftOpen ? `${LEFT_DRAWER_WIDTH}px` : 0 },
        mr: { lg: rightOpen ? `${RIGHT_DRAWER_WIDTH}px` : 0 },
        minHeight: 0,
        overflow: "auto",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, sm: 2.5, md: 3 },
          px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
        }}
      >
        {children ?? <Outlet />}
      </Container>
    </Box>
  );
}
