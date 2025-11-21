import { Box, Stack, Typography, Chip, IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import type { PlanReference } from "../../../../types";

export type ReferenceItemProps = {
  readonly reference: PlanReference;
  readonly isLast: boolean;
  readonly getTypeIcon: (type: PlanReference["type"]) => React.ReactNode;
  readonly getTypeColor: (type: PlanReference["type"]) => string;
  readonly getTypeLabel: (type: PlanReference["type"]) => string;
  readonly onEdit: (reference: PlanReference) => void;
  readonly onDelete: (referenceId: string) => void;
  readonly onOpenLink?: (url?: string) => void;
  readonly onScrollToDate?: (date: string) => void;
};

export function ReferenceItem({
  reference,
  isLast,
  getTypeIcon,
  getTypeColor,
  getTypeLabel,
  onEdit,
  onDelete,
  onOpenLink,
  onScrollToDate,
}: ReferenceItemProps) {
  const theme = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      reference.date &&
      typeof reference.date === "string" &&
      reference.date.trim() !== "" &&
      onScrollToDate
    ) {
      onScrollToDate(reference.date);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(reference);
  };

  const handleOpenLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenLink) {
      onOpenLink(reference.url);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(reference);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(reference.id);
  };

  return (
    <Box>
      <Box
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: { xs: 0.75, sm: 1 },
          px: { xs: 1, sm: 1.25 },
          py: { xs: 0.75, sm: 1 },
          cursor: "pointer",
          transition: theme.transitions.create(["background-color", "border-color"], {
            duration: theme.transitions.duration.shorter,
          }),
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
          {reference.type === "link" && reference.url && (
            <Tooltip title="Open link" arrow placement="top">
              <IconButton
                size="small"
                onClick={handleOpenLinkClick}
                sx={{
                  fontSize: { xs: 14, sm: 16 },
                  p: { xs: 0.375, sm: 0.5 },
                  color: theme.palette.text.secondary,
                  transition: theme.transitions.create(["color", "background-color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "&:hover": {
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <OpenInNewIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
          {!reference.date && !reference.phaseId && (
            <>
              <Tooltip title="Edit" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={handleEditClick}
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    p: { xs: 0.375, sm: 0.5 },
                    color: theme.palette.text.secondary,
                    transition: theme.transitions.create(["color", "background-color"], {
                      duration: theme.transitions.duration.shorter,
                    }),
                    "&:hover": {
                      color: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    p: { xs: 0.375, sm: 0.5 },
                    color: theme.palette.text.secondary,
                    transition: theme.transitions.create(["color", "background-color"], {
                      duration: theme.transitions.duration.shorter,
                    }),
                    "&:hover": {
                      color: theme.palette.error.main,
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                    },
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>

        {/* Reference Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 0.75 }}
            alignItems="center"
            sx={{ mb: 0.25 }}
            flexWrap="nowrap"
          >
            <Chip
              icon={getTypeIcon(reference.type)}
              label={getTypeLabel(reference.type)}
              size="small"
              sx={{
                bgcolor: alpha(getTypeColor(reference.type), 0.1),
                color: getTypeColor(reference.type),
                fontWeight: 500,
                fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                height: { xs: 16, sm: 18 },
                flexShrink: 0,
                "& .MuiChip-icon": {
                  fontSize: { xs: 10, sm: 12 },
                  color: getTypeColor(reference.type),
                },
                "& .MuiChip-label": {
                  px: { xs: 0.5, sm: 0.75 },
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "0.6875rem", sm: "0.75rem" },
                flex: 1,
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {reference.title}
            </Typography>
          </Stack>
          {(reference.date || reference.description) && (
            <Stack spacing={0.25} sx={{ mt: 0.25 }}>
              {reference.date && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  <CalendarIcon sx={{ fontSize: 10, opacity: 0.7 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {reference.phaseId ? (
                      <>
                        <TimelineIcon
                          sx={{ fontSize: 8, mx: 0.25, verticalAlign: "middle" }}
                        />
                        Cell: {reference.date}
                      </>
                    ) : (
                      <>Day: {reference.date}</>
                    )}
                  </Typography>
                </Stack>
              )}
              {reference.description && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  title={reference.description}
                >
                  {reference.description}
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Box>
      {!isLast && (
        <Box
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        />
      )}
    </Box>
  );
}

