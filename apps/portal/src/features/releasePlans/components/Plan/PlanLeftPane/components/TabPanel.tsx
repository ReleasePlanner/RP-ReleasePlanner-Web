import { memo } from "react";
import { Box, IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { getTimelineColors } from "../../../Gantt/GanttTimeline/constants";

export type TabPanelProps = {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
  readonly onSave?: () => Promise<void>;
  readonly isSaving?: boolean;
  readonly hasPendingChanges?: boolean;
};

export const TabPanel = memo(
  function TabPanel({
    children,
    value,
    index,
    onSave,
    isSaving,
    hasPendingChanges = false,
  }: TabPanelProps) {
    const theme = useTheme();
    const colors = getTimelineColors(theme);

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`plan-tabpanel-${index}`}
        aria-labelledby={`plan-tab-${index}`}
        style={{
          height: "100%",
          width: "100%",
          display: value === index ? "flex" : "none",
          flexDirection: "column",
        }}
      >
        {value === index && (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Minimalist save button at top - always visible, enabled only when there are pending changes */}
            {onSave && (
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 12,
                  display: "flex",
                  justifyContent: "flex-end",
                  px: 1.5,
                  py: 0.75,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.95)
                      : alpha(theme.palette.background.paper, 0.98),
                  backdropFilter: "blur(12px)",
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`
                      : `0 1px 4px ${alpha(theme.palette.common.black, 0.08)}`,
                }}
              >
                <Tooltip
                  title={
                    isSaving
                      ? "Guardando..."
                      : hasPendingChanges
                        ? "Save changes"
                        : "No hay cambios pendientes"
                  }
                  arrow
                  placement="bottom"
                >
                  <span>
                    <IconButton
                      onClick={async () => {
                        if (onSave) {
                          try {
                            await onSave();
                          } catch (error) {
                            console.error("[TabPanel] Error saving tab:", error);
                          }
                        }
                      }}
                      disabled={isSaving || !hasPendingChanges}
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: hasPendingChanges
                          ? theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.main, 0.9)
                            : theme.palette.primary.main
                          : colors.BUTTON_BG,
                        color: hasPendingChanges
                          ? theme.palette.primary.contrastText
                          : colors.BUTTON_TEXT,
                        border: `1px solid ${
                          hasPendingChanges
                            ? theme.palette.primary.main
                            : colors.BORDER
                        }`,
                        "&:hover": {
                          backgroundColor: hasPendingChanges
                            ? theme.palette.mode === "dark"
                              ? alpha(theme.palette.primary.main, 1)
                              : theme.palette.primary.dark
                            : colors.BUTTON_BG_HOVER,
                          transform: hasPendingChanges ? "scale(1.05)" : "scale(1)",
                        },
                        "&:disabled": {
                          backgroundColor: colors.BUTTON_BG,
                          color: colors.BUTTON_TEXT,
                          opacity: 0.5,
                          borderColor: colors.BORDER,
                        },
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: hasPendingChanges
                          ? theme.palette.mode === "dark"
                            ? `0 2px 6px ${alpha(theme.palette.primary.main, 0.4)}`
                            : `0 2px 4px ${alpha(theme.palette.primary.main, 0.3)}`
                          : theme.palette.mode === "dark"
                            ? `0 1px 3px ${alpha(theme.palette.common.black, 0.2)}`
                            : `0 1px 2px ${alpha(theme.palette.common.black, 0.1)}`,
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
              </Box>
            )}
            {children}
          </Box>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
      prevProps.value === nextProps.value &&
      prevProps.index === nextProps.index &&
      prevProps.isSaving === nextProps.isSaving &&
      prevProps.hasPendingChanges === nextProps.hasPendingChanges &&
      prevProps.onSave === nextProps.onSave &&
      prevProps.children === nextProps.children
    );
  }
);

