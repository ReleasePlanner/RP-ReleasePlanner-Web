import { Box, Typography, ToggleButtonGroup, ToggleButton, Stack, useTheme, alpha } from "@mui/material";
import {
  Link as LinkIcon,
  Description as DocumentIcon,
  Note as NoteIcon,
  Flag as MilestoneIcon,
} from "@mui/icons-material";
import type { PlanReferenceType } from "../../../../../types";

export type TypeSelectorProps = {
  readonly type: PlanReferenceType;
  readonly onChange: (type: PlanReferenceType) => void;
  readonly getTypeColor: (type: PlanReferenceType) => string;
};

export function TypeSelector({
  type,
  onChange,
  getTypeColor,
}: TypeSelectorProps) {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 1,
          fontWeight: 500,
          fontSize: "0.75rem",
          color: theme.palette.text.secondary,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Tipo
      </Typography>
      <ToggleButtonGroup
        value={type}
        exclusive
        onChange={(_, newType) => newType && onChange(newType)}
        fullWidth
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          "& .MuiToggleButtonGroup-grouped": {
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 1,
            px: 1.5,
            py: 1,
            textTransform: "none",
            "&:not(:first-of-type)": {
              borderLeft: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              marginLeft: 0,
            },
            "&.Mui-selected": {
              bgcolor: alpha(getTypeColor(type), 0.1),
              borderColor: getTypeColor(type),
              color: getTypeColor(type),
              "&:hover": {
                bgcolor: alpha(getTypeColor(type), 0.15),
              },
            },
            "&:hover": {
              bgcolor: alpha(theme.palette.action.hover, 0.04),
            },
          },
        }}
      >
        <ToggleButton value="link">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <LinkIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
              Enlace
            </Typography>
          </Stack>
        </ToggleButton>
        <ToggleButton value="document">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <DocumentIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
              Documento
            </Typography>
          </Stack>
        </ToggleButton>
        <ToggleButton value="note">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <NoteIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
              Nota
            </Typography>
          </Stack>
        </ToggleButton>
        <ToggleButton value="milestone">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <MilestoneIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
              Hito
            </Typography>
          </Stack>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

