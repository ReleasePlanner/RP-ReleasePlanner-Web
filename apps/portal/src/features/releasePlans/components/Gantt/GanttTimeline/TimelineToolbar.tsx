import { useTheme, alpha, Box, IconButton, Tooltip, Chip } from "@mui/material";
import { Today as TodayIcon, Save as SaveIcon } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { getTimelineColors } from "./constants";

// Toolbar height: py: 0.75 (6px top + 6px bottom) + content (~28px) = ~40px
export const TOOLBAR_HEIGHT = 40;

export type TimelineToolbarProps = {
  onJumpToToday?: () => void;
  onSave?: () => void;
  hasChanges?: boolean;
  isSaving?: boolean;
};

/**
 * Elegant floating toolbar for timeline
 * Combines legend, Today button, and Save button in a minimal Material UI design
 */
export function TimelineToolbar({
  onJumpToToday,
  onSave,
  hasChanges = false,
  isSaving = false,
}: TimelineToolbarProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 15,
        height: `${TOOLBAR_HEIGHT}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.5,
        py: 0.75,
        backgroundColor: theme.palette.mode === "dark"
          ? alpha(theme.palette.background.paper, 0.95)
          : alpha(theme.palette.background.paper, 0.98),
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${alpha(colors.BORDER, 0.5)}`,
        boxShadow: theme.palette.mode === "dark"
          ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`
          : `0 1px 4px ${alpha(theme.palette.common.black, 0.08)}`,
        // Ensure toolbar doesn't affect layout flow
        marginBottom: 0,
        flexShrink: 0,
      }}
    >
      {/* Left side: Legend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontSize: "0.6875rem",
          color: colors.TEXT_SECONDARY,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 0.5,
              border: `1px solid ${colors.WEEKEND_BORDER}`,
              backgroundColor: colors.WEEKEND_BG,
            }}
          />
          <Box component="span" sx={{ fontWeight: 500 }}>
            Weekend
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 0,
              height: 12,
              borderLeft: `2px solid ${colors.TODAY_MARKER}`,
            }}
          />
          <Box component="span" sx={{ fontWeight: 500 }}>
            Today
          </Box>
        </Box>
      </Box>

      {/* Right side: Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Today button */}
        {onJumpToToday && (
          <Tooltip title="Ir a hoy" arrow placement="bottom">
            <IconButton
              onClick={onJumpToToday}
              size="small"
              sx={{
                width: 32,
                height: 32,
                backgroundColor: colors.BUTTON_BG,
                color: colors.BUTTON_TEXT,
                border: `1px solid ${colors.BORDER}`,
                "&:hover": {
                  backgroundColor: colors.BUTTON_BG_HOVER,
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: theme.palette.mode === "dark"
                  ? `0 1px 3px ${alpha(theme.palette.common.black, 0.2)}`
                  : `0 1px 2px ${alpha(theme.palette.common.black, 0.1)}`,
              }}
            >
              <TodayIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Save button */}
        {onSave && (
          <Tooltip
            title={
              isSaving
                ? "Saving..."
                : hasChanges
                  ? "Save timeline changes"
                  : "No pending changes"
            }
            arrow
            placement="bottom"
          >
            <span>
              <IconButton
                onClick={onSave}
                disabled={isSaving || !hasChanges}
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: hasChanges
                    ? (theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.9)
                        : theme.palette.primary.main)
                    : colors.BUTTON_BG,
                  color: hasChanges
                    ? theme.palette.primary.contrastText
                    : colors.BUTTON_TEXT,
                  border: `1px solid ${
                    hasChanges ? theme.palette.primary.main : colors.BORDER
                  }`,
                  "&:hover": {
                    backgroundColor: hasChanges
                      ? (theme.palette.mode === "dark"
                          ? alpha(theme.palette.primary.main, 1)
                          : theme.palette.primary.dark)
                      : colors.BUTTON_BG_HOVER,
                    transform: hasChanges ? "scale(1.05)" : "scale(1)",
                  },
                  "&:disabled": {
                    backgroundColor: colors.BUTTON_BG,
                    color: colors.BUTTON_TEXT,
                    opacity: 0.5,
                    borderColor: colors.BORDER,
                  },
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: hasChanges
                    ? (theme.palette.mode === "dark"
                        ? `0 2px 6px ${alpha(theme.palette.primary.main, 0.4)}`
                        : `0 2px 4px ${alpha(theme.palette.primary.main, 0.3)}`)
                    : (theme.palette.mode === "dark"
                        ? `0 1px 3px ${alpha(theme.palette.common.black, 0.2)}`
                        : `0 1px 2px ${alpha(theme.palette.common.black, 0.1)}`),
                }}
              >
                {isSaving ? (
                  <CircularProgress size={16} sx={{ color: "inherit" }} />
                ) : (
                  <SaveIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

