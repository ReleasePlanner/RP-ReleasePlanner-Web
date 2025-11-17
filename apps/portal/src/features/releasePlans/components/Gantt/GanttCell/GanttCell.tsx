import { useState, useCallback, useMemo } from "react";
import { useTheme, alpha, Menu, MenuItem, Divider, Chip, Box, Badge, Tooltip } from "@mui/material";
import {
  Comment as CommentIcon,
  AttachFile as FileIcon,
  Link as LinkIcon,
  Flag as MilestoneIcon,
} from "@mui/icons-material";
import type { GanttCellData, PlanReference } from "../../../types";
import { getTimelineColors } from "../GanttTimeline/constants";

export type GanttCellProps = {
  phaseId: string;
  date: string; // ISO date (YYYY-MM-DD)
  left: number;
  top: number;
  width: number;
  height: number;
  cellData?: GanttCellData;
  milestoneReference?: PlanReference; // Full milestone reference with title, description, etc.
  onCellDataChange?: (data: GanttCellData) => void;
  onAddComment?: (phaseId: string, date: string) => void;
  onAddFile?: (phaseId: string, date: string) => void;
  onAddLink?: (phaseId: string, date: string) => void;
  onToggleMilestone?: (phaseId: string, date: string) => void;
};

export default function GanttCell({
  phaseId,
  date,
  left,
  top,
  width,
  height,
  cellData,
  milestoneReference,
  onCellDataChange,
  onAddComment,
  onAddFile,
  onAddLink,
  onToggleMilestone,
}: GanttCellProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null
      );
    },
    [contextMenu]
  );

  const handleClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleAddComment = useCallback(() => {
    handleClose();
    if (onAddComment) {
      onAddComment(phaseId, date);
    }
  }, [handleClose, onAddComment, phaseId, date]);

  const handleAddFile = useCallback(() => {
    handleClose();
    if (onAddFile) {
      onAddFile(phaseId, date);
    }
  }, [handleClose, onAddFile, phaseId, date]);

  const handleAddLink = useCallback(() => {
    handleClose();
    if (onAddLink) {
      onAddLink(phaseId, date);
    }
  }, [handleClose, onAddLink, phaseId, date]);

  const handleToggleMilestone = useCallback(() => {
    handleClose();
    if (onToggleMilestone) {
      onToggleMilestone(phaseId, date);
    }
  }, [handleClose, onToggleMilestone, phaseId, date]);

  // Show milestone if cellData has isMilestone flag OR if there's a milestoneReference
  const isMilestone = (cellData?.isMilestone ?? false) || milestoneReference !== undefined;
  const commentsCount = cellData?.comments?.length ?? 0;
  const filesCount = cellData?.files?.length ?? 0;
  const linksCount = cellData?.links?.length ?? 0;
  const hasData = commentsCount > 0 || filesCount > 0 || linksCount > 0;
  
  // Calculate total data items count
  const totalDataItems = commentsCount + filesCount + linksCount;
  const hasMultipleItems = totalDataItems > 1;
  
  // Data items array for rendering
  const dataItems = useMemo(() => {
    const items: Array<{ type: "comment" | "file" | "link"; count: number; icon: React.ReactNode; color: string }> = [];
    if (commentsCount > 0) {
      items.push({
        type: "comment",
        count: commentsCount,
        icon: <CommentIcon sx={{ fontSize: 10 }} />,
        color: theme.palette.info.main,
      });
    }
    if (filesCount > 0) {
      items.push({
        type: "file",
        count: filesCount,
        icon: <FileIcon sx={{ fontSize: 10 }} />,
        color: theme.palette.success.main,
      });
    }
    if (linksCount > 0) {
      items.push({
        type: "link",
        count: linksCount,
        icon: <LinkIcon sx={{ fontSize: 10 }} />,
        color: theme.palette.primary.main,
      });
    }
    return items;
  }, [commentsCount, filesCount, linksCount, theme]);

  return (
    <>
      <div
        className="absolute cursor-pointer"
        style={{
          left,
          top,
          width,
          height,
          zIndex: 1,
        }}
        onContextMenu={handleContextMenu}
        onClick={(e) => {
          // Prevent phase bar click when clicking cell
          e.stopPropagation();
        }}
      >
        {/* Milestone indicator - Enhanced with tooltip */}
        {isMilestone && (
          <Tooltip
            title={
              <div style={{ fontSize: "0.8125rem", maxWidth: 300 }}>
                <div style={{ fontWeight: 600, marginBottom: "6px", fontSize: "0.875rem" }}>
                  {milestoneReference?.title || "Milestone"}
                </div>
                {milestoneReference?.description && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.9,
                      marginBottom: "4px",
                      lineHeight: 1.5,
                    }}
                  >
                    {milestoneReference.description}
                  </div>
                )}
                <div style={{ fontSize: "0.6875rem", opacity: 0.8, marginTop: "4px" }}>
                  📅 {date}
                </div>
                {milestoneReference?.milestoneColor && (
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      opacity: 0.8,
                      marginTop: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: milestoneReference.milestoneColor,
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }}
                    />
                    Color: {milestoneReference.milestoneColor}
                  </div>
                )}
              </div>
            }
            arrow
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                  '& .MuiTooltip-arrow': {
                    color: 'rgba(0, 0, 0, 0.9)',
                  },
                },
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 0,
                height: 0,
                borderLeft: `8px solid transparent`,
                borderRight: `8px solid transparent`,
                borderTop: `12px solid ${
                  cellData?.milestoneColor ?? milestoneReference?.milestoneColor ?? theme.palette.warning.main
                }`,
                zIndex: 3,
                filter: `drop-shadow(0 2px 4px ${alpha(
                  cellData?.milestoneColor ?? milestoneReference?.milestoneColor ?? theme.palette.warning.main,
                  0.4
                )})`,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.15)",
                  filter: `drop-shadow(0 3px 6px ${alpha(
                    cellData?.milestoneColor ?? milestoneReference?.milestoneColor ?? theme.palette.warning.main,
                    0.6
                  )})`,
                },
              }}
            />
          </Tooltip>
        )}

        {/* Data indicators - Column layout when multiple items */}
        {hasData && (
          <Box
            sx={{
              position: "absolute",
              bottom: 1,
              left: 1,
              zIndex: 2,
              display: "flex",
              flexDirection: hasMultipleItems ? "column" : "row",
              gap: hasMultipleItems ? 0.25 : 0.5,
              alignItems: "flex-start",
            }}
          >
            {dataItems.map((item, index) => (
              <Badge
                key={item.type}
                badgeContent={item.count}
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.5rem",
                    height: 10,
                    minWidth: 10,
                    padding: "0 2px",
                    backgroundColor: item.color,
                    color: theme.palette.getContrastText(item.color),
                    fontWeight: 600,
                    border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                    boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.2)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 12,
                    height: 12,
                    borderRadius: "2px",
                    backgroundColor: alpha(item.color, 0.15),
                    border: `1px solid ${alpha(item.color, 0.3)}`,
                    color: item.color,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(item.color, 0.25),
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {item.icon}
                </Box>
              </Badge>
            ))}
          </Box>
        )}

        {/* Hover effect */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: theme.palette.mode === "dark"
              ? `0 4px 16px ${alpha(theme.palette.common.black, 0.4)}`
              : `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
            border: `1px solid ${colors.BORDER}`,
          },
        }}
      >
        <MenuItem
          onClick={handleAddComment}
          sx={{
            py: 1,
            px: 2,
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: alpha(theme.palette.info.main, 0.1),
            },
          }}
        >
          <CommentIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              color: theme.palette.info.main,
            }}
          />
          <span>Comentarios</span>
          {commentsCount > 0 && (
            <Chip
              label={commentsCount}
              size="small"
              sx={{
                ml: "auto",
                height: 20,
                fontSize: "0.6875rem",
                backgroundColor: alpha(theme.palette.info.main, 0.15),
                color: theme.palette.info.main,
              }}
            />
          )}
        </MenuItem>
        <MenuItem
          onClick={handleAddFile}
          sx={{
            py: 1,
            px: 2,
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: alpha(theme.palette.success.main, 0.1),
            },
          }}
        >
          <FileIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              color: theme.palette.success.main,
            }}
          />
          <span>Archivos</span>
          {filesCount > 0 && (
            <Chip
              label={filesCount}
              size="small"
              sx={{
                ml: "auto",
                height: 20,
                fontSize: "0.6875rem",
                backgroundColor: alpha(theme.palette.success.main, 0.15),
                color: theme.palette.success.main,
              }}
            />
          )}
        </MenuItem>
        <MenuItem
          onClick={handleAddLink}
          sx={{
            py: 1,
            px: 2,
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <LinkIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              color: theme.palette.primary.main,
            }}
          />
          <span>Enlaces</span>
          {linksCount > 0 && (
            <Chip
              label={linksCount}
              size="small"
              sx={{
                ml: "auto",
                height: 20,
                fontSize: "0.6875rem",
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
              }}
            />
          )}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleToggleMilestone}
          sx={{
            py: 1,
            px: 2,
            fontSize: "0.875rem",
            backgroundColor: isMilestone
              ? alpha(theme.palette.warning.main, 0.1)
              : "transparent",
            "&:hover": {
              backgroundColor: alpha(theme.palette.warning.main, 0.15),
            },
          }}
        >
          <MilestoneIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              color: isMilestone
                ? theme.palette.warning.main
                : theme.palette.text.secondary,
            }}
          />
          <span>{isMilestone ? "Quitar Milestone" : "Marcar como Milestone"}</span>
        </MenuItem>
      </Menu>
    </>
  );
}

