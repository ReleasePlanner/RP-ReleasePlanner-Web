import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

export type DialogHeaderProps = {
  readonly isCreating?: boolean;
};

export function DialogHeader({ isCreating }: DialogHeaderProps) {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
        }}
      >
        <AddIcon sx={{ fontSize: 22 }} />
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            letterSpacing: "-0.01em",
            color: theme.palette.text.primary,
            mb: 0.25,
          }}
        >
          Add Phases
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.8125rem",
            color: theme.palette.text.secondary,
            fontWeight: 400,
          }}
        >
          Select phases from maintenance or create a new phase only for this plan
        </Typography>
      </Box>
    </Stack>
  );
}

