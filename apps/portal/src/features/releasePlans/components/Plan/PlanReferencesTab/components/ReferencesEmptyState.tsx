import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import { Note as NoteIcon } from "@mui/icons-material";

export function ReferencesEmptyState() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
        textAlign: "center",
        p: 4,
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NoteIcon
            sx={{ fontSize: 20, color: theme.palette.primary.main, opacity: 0.6 }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          No references added yet
        </Typography>
        <Typography
          variant="caption"
          sx={{
            opacity: 0.7,
            fontSize: "0.625rem",
            maxWidth: 280,
            lineHeight: 1.5,
          }}
        >
          Add links, documents or notes related to this plan
        </Typography>
      </Stack>
    </Box>
  );
}

