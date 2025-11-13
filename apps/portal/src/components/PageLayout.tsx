/**
 * PageLayout Component
 *
 * Consistent, elegant page layout for all maintenance pages
 * Following Material UI design principles
 */

import { Box, Typography, useTheme, alpha } from "@mui/material";
import type { ReactNode } from "react";

interface PageLayoutProps {
  /**
   * Page title
   */
  title: string;
  /**
   * Optional page description
   */
  description?: string;
  /**
   * Toolbar content (filters, search, view toggles)
   */
  toolbar?: ReactNode;
  /**
   * Action buttons (Add, Export, etc.)
   */
  actions?: ReactNode;
  /**
   * Main content of the page
   */
  children: ReactNode;
}

/**
 * PageLayout Component
 *
 * Provides consistent layout structure for all pages:
 * - Elegant header with title and description
 * - Toolbar area for filters and controls
 * - Action buttons aligned to the right
 * - Responsive spacing and typography
 * - Material UI compliant design
 *
 * @example
 * ```tsx
 * <PageLayout
 *   title="Product Maintenance"
 *   description="Manage products and components"
 *   toolbar={<ProductToolbar />}
 *   actions={<Button>Add Product</Button>}
 * >
 *   <ProductsList />
 * </PageLayout>
 * ```
 */
export function PageLayout({
  title,
  description,
  toolbar,
  actions,
  children,
}: PageLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1600px",
        mx: "auto",
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
            color: theme.palette.text.primary,
            mb: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              maxWidth: "600px",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Toolbar and Actions */}
      {(toolbar || actions) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            pb: 3,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            flexWrap: "wrap",
          }}
        >
          {/* Toolbar (filters, search, etc.) */}
          {toolbar && (
            <Box sx={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}>
              {toolbar}
            </Box>
          )}

          {/* Actions (buttons) */}
          {actions && (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                ml: { xs: 0, sm: "auto" },
              }}
            >
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          pb: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
