import { Box, Typography, Button, Tooltip, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

export type ReferencesHeaderProps = {
  readonly count: number;
  readonly onAdd: () => void;
};

export function ReferencesHeader({ count, onAdd }: ReferencesHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        pb: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        flexShrink: 0,
        flexWrap: { xs: "wrap", sm: "nowrap" },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "0.625rem", sm: "0.6875rem" },
          color: theme.palette.text.primary,
          flex: { xs: "1 1 100%", sm: "0 1 auto" },
        }}
      >
        References ({count})
      </Typography>
      <Tooltip title="Add reference" arrow placement="top">
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 14 }} />}
          onClick={onAdd}
          sx={{
            textTransform: "none",
            fontSize: { xs: "0.625rem", sm: "0.6875rem" },
            fontWeight: 500,
            px: { xs: 1, sm: 1.25 },
            py: 0.5,
            borderRadius: 1,
            minHeight: 26,
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
            flexShrink: 0,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          Add
        </Button>
      </Tooltip>
    </Box>
  );
}

