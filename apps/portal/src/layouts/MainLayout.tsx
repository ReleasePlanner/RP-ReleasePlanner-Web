import type { PropsWithChildren } from "react";
import { Box, CssBaseline } from "@mui/material";
import HeaderMaterial from "./HeaderMaterial";
import {
  LeftSidebar,
  RightSidebar,
  MainContent,
  LayoutFooter,
} from "./components";

/**
 * MainLayout Component
 *
 * Root layout component that manages the overall page structure.
 * Composes responsive sidebars, header, main content, and footer.
 *
 * @example
 * ```tsx
 * <MainLayout>
 *   <Outlet />
 * </MainLayout>
 * ```
 */
export function MainLayout({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        height: "100vh",
        width: "100%",
      }}
    >
      <CssBaseline />
      <HeaderMaterial />
      <MainContent>{children}</MainContent>
      <LayoutFooter />
      <LeftSidebar />
      <RightSidebar />
    </Box>
  );
}
