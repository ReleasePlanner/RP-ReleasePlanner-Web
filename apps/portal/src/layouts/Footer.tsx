import { useMemo } from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Footer Component
 *
 * Displays footer with copyright info and back-to-top link.
 * Uses Material UI for consistent theming and responsive design.
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        py: 1.5,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © {year} Release Planner
        </Typography>
        <Link
          href="#top"
          sx={{
            textDecoration: "none",
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
            },
            cursor: "pointer",
            transition: theme.transitions.create("color"),
          }}
        >
          <Typography variant="caption">Back to top</Typography>
        </Link>
      </Container>
    </Box>
  );
}
