import { useState, useCallback } from "react";
import { TIMELINE_DIMENSIONS, getTimelineColors } from "./constants";
import {
  Tooltip,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Box,
  Badge,
} from "@mui/material";
import {
  Flag as FlagIcon,
  Comment as CommentIcon,
  AttachFile as FileIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import type { PlanMilestone, GanttCellData } from "../../../types";

export type TimelineRowProps = {
  height: number;
  children: React.ReactNode;
};

export function TimelineRow({ height, children }: TimelineRowProps) {
  return (
    <div className="relative" style={{ height, width: "100%", position: "relative", overflow: "visible" }}>
      {children}
    </div>
  );
}

export type MonthSegment = {
  startIndex: number;
  length: number;
  label: string;
};

export type MonthsRowProps = {
  monthSegments: MonthSegment[];
  pxPerDay: number;
};

export function MonthsRow({ monthSegments, pxPerDay }: MonthsRowProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.MONTHS_ROW_HEIGHT}>
      {monthSegments.map((m) => (
        <div
          key={m.startIndex}
          className="absolute top-0 flex items-center justify-center border-r"
          style={{
            left: m.startIndex * pxPerDay,
            width: m.length * pxPerDay,
            height: TIMELINE_DIMENSIONS.MONTHS_ROW_HEIGHT,
            color: colors.TEXT_PRIMARY,
            borderColor: colors.BORDER_LIGHT,
            fontSize: "0.8125rem",
            fontWeight: 700,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            backgroundColor: theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(0, 0, 0, 0.01)",
          }}
        >
          {m.label}
        </div>
      ))}
    </TimelineRow>
  );
}

export type WeekSegment = {
  startIndex: number;
  length: number;
  label: string;
};

export type WeeksRowProps = {
  weekSegments: WeekSegment[];
  pxPerDay: number;
};

export function WeeksRow({ weekSegments, pxPerDay }: WeeksRowProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.WEEKS_ROW_HEIGHT}>
      {weekSegments.map((w) => (
        <div
          key={w.startIndex}
          className="absolute top-0 flex items-center justify-center border-r border-b"
          style={{
            left: w.startIndex * pxPerDay,
            width: w.length * pxPerDay,
            height: TIMELINE_DIMENSIONS.WEEKS_ROW_HEIGHT,
            color: colors.TEXT_SECONDARY,
            borderColor: colors.BORDER_LIGHT,
            borderBottomWidth: "1px",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          {w.label}
        </div>
      ))}
    </TimelineRow>
  );
}

export type DaysRowProps = {
  days: Date[];
  pxPerDay: number;
  milestones?: Map<string, PlanMilestone>;
  onDayClick?: (date: string) => void;
  // Cell data props for day-level data
  cellData?: GanttCellData[];
  onAddCellComment?: (date: string) => void;
  onAddCellFile?: (date: string) => void;
  onAddCellLink?: (date: string) => void;
  onToggleCellMilestone?: (date: string) => void;
};

/* @refresh reset */
export function DaysRow({
  days,
  pxPerDay,
  milestones = new Map(),
  onDayClick,
  cellData = [],
  onAddCellComment,
  onAddCellFile,
  onAddCellLink,
  onToggleCellMilestone,
}: DaysRowProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    date: string;
  } | null>(null);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, date: string) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
              date,
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
    if (contextMenu && onAddCellComment) {
      onAddCellComment(contextMenu.date);
    }
    handleClose();
  }, [contextMenu, onAddCellComment, handleClose]);

  const handleAddFile = useCallback(() => {
    if (contextMenu && onAddCellFile) {
      onAddCellFile(contextMenu.date);
    }
    handleClose();
  }, [contextMenu, onAddCellFile, handleClose]);

  const handleAddLink = useCallback(() => {
    if (contextMenu && onAddCellLink) {
      onAddCellLink(contextMenu.date);
    }
    handleClose();
  }, [contextMenu, onAddCellLink, handleClose]);

  const handleToggleMilestone = useCallback(() => {
    if (contextMenu && onToggleCellMilestone) {
      onToggleCellMilestone(contextMenu.date);
    }
    handleClose();
  }, [contextMenu, onToggleCellMilestone, handleClose]);

  // Calculate total width needed for all days
  const totalWidth = days.length * pxPerDay;

  return (
    <>
      <TimelineRow height={TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT}>
        <div
          style={{
            position: "relative",
            width: `${totalWidth}px`,
            minWidth: `${totalWidth}px`,
            height: TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT,
          }}
        >
          {days.map((d, i) => {
          const dateKey = d.toISOString().slice(0, 10);
          const milestone = milestones.get(dateKey);
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          
          // Find day-level cell data (without phaseId)
          const dayCellData = cellData.find(
            (cd) => cd.date === dateKey && !cd.phaseId
          );
          
          const commentsCount = dayCellData?.comments?.length ?? 0;
          const filesCount = dayCellData?.files?.length ?? 0;
          const linksCount = dayCellData?.links?.length ?? 0;
          const hasData = commentsCount > 0 || filesCount > 0 || linksCount > 0;
          const isDayMilestone = dayCellData?.isMilestone ?? false;
          
          const totalDataItems = commentsCount + filesCount + linksCount;
          const hasMultipleItems = totalDataItems > 1;
          
          // Calculate data items directly (no useMemo inside map - violates hooks rules)
          const dataItems: Array<{ type: "comment" | "file" | "link"; count: number; icon: React.ReactNode; color: string }> = [];
          if (commentsCount > 0) {
            dataItems.push({
              type: "comment",
              count: commentsCount,
              icon: <CommentIcon sx={{ fontSize: 8 }} />,
              color: theme.palette.info.main,
            });
          }
          if (filesCount > 0) {
            dataItems.push({
              type: "file",
              count: filesCount,
              icon: <FileIcon sx={{ fontSize: 8 }} />,
              color: theme.palette.success.main,
            });
          }
          if (linksCount > 0) {
            dataItems.push({
              type: "link",
              count: linksCount,
              icon: <LinkIcon sx={{ fontSize: 8 }} />,
              color: theme.palette.primary.main,
            });
          }

          return (
            <div
              key={`day-${i}-${dateKey}`}
              className="absolute top-0 border-r flex items-center justify-center"
              style={{
                left: `${i * pxPerDay}px`,
                width: `${pxPerDay}px`,
                minWidth: `${pxPerDay}px`,
                height: TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT,
                backgroundColor: isWeekend ? colors.WEEKEND_BG : undefined,
                borderColor: colors.BORDER_LIGHT,
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isWeekend 
                  ? colors.WEEKEND_BG 
                  : undefined;
              }}
              onContextMenu={(e) => handleContextMenu(e, dateKey)}
              onClick={() => {
                if (onDayClick) {
                  onDayClick(dateKey);
                }
              }}
            >
              {/* Day number - Ensure it's visible with proper z-index */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  color: theme.palette.mode === "dark" 
                    ? "rgba(255, 255, 255, 0.85)" 
                    : colors.TEXT_MUTED,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  userSelect: "none",
                  pointerEvents: "none",
                  textShadow: theme.palette.mode === "dark"
                    ? "0 1px 2px rgba(0, 0, 0, 0.5)"
                    : "none",
                }}
              >
                {d.getDate()}
              </Box>
              
              {/* Day-level milestone indicator */}
              {isDayMilestone && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    borderLeft: `4px solid transparent`,
                    borderRight: `4px solid transparent`,
                    borderTop: `4px solid ${
                      dayCellData?.milestoneColor ?? theme.palette.warning.main
                    }`,
                    zIndex: 3,
                    pointerEvents: "none",
                  }}
                />
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
                    gap: hasMultipleItems ? 0.2 : 0.4,
                    alignItems: "flex-start",
                    pointerEvents: "none",
                  }}
                >
                  {dataItems.map((item) => (
                    <Badge
                      key={item.type}
                      badgeContent={item.count}
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "0.5rem",
                          height: 9,
                          minWidth: 9,
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
                          width: 10,
                          height: 10,
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
              
              {/* Milestone marker (plan-level milestone) */}
              {milestone && (
                <Tooltip
                  title={
                    <div style={{ fontSize: "0.75rem" }}>
                      <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                        {milestone.name}
                      </div>
                      {milestone.description && (
                        <div style={{ fontSize: "0.7rem", opacity: 0.9 }}>
                          {milestone.description}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "0.7rem",
                          opacity: 0.8,
                          marginTop: "4px",
                        }}
                      >
                        {dateKey}
                      </div>
                    </div>
                  }
                  arrow
                  placement="top"
                >
                  <FlagIcon
                    sx={{
                      position: "absolute",
                      top: -2,
                      right: 2,
                      fontSize: "12px",
                      color:
                        theme.palette.mode === "dark" ? "#fbbf24" : "#f59e0b",
                      filter:
                        theme.palette.mode === "dark"
                          ? "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
                          : "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                      zIndex: 2,
                      pointerEvents: "auto",
                    }}
                  />
                </Tooltip>
              )}
            </div>
          );
        })}
        </div>
      </TimelineRow>

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
          {contextMenu && (() => {
            const dayData = cellData.find(
              (cd) => cd.date === contextMenu.date && !cd.phaseId
            );
            const count = dayData?.comments?.length ?? 0;
            return count > 0 ? (
              <Chip
                label={count}
                size="small"
                sx={{
                  ml: "auto",
                  height: 20,
                  fontSize: "0.6875rem",
                  backgroundColor: alpha(theme.palette.info.main, 0.15),
                  color: theme.palette.info.main,
                }}
              />
            ) : null;
          })()}
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
          {contextMenu && (() => {
            const dayData = cellData.find(
              (cd) => cd.date === contextMenu.date && !cd.phaseId
            );
            const count = dayData?.files?.length ?? 0;
            return count > 0 ? (
              <Chip
                label={count}
                size="small"
                sx={{
                  ml: "auto",
                  height: 20,
                  fontSize: "0.6875rem",
                  backgroundColor: alpha(theme.palette.success.main, 0.15),
                  color: theme.palette.success.main,
                }}
              />
            ) : null;
          })()}
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
          {contextMenu && (() => {
            const dayData = cellData.find(
              (cd) => cd.date === contextMenu.date && !cd.phaseId
            );
            const count = dayData?.links?.length ?? 0;
            return count > 0 ? (
              <Chip
                label={count}
                size="small"
                sx={{
                  ml: "auto",
                  height: 20,
                  fontSize: "0.6875rem",
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                }}
              />
            ) : null;
          })()}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleToggleMilestone}
          sx={{
            py: 1,
            px: 2,
            fontSize: "0.875rem",
            backgroundColor:
              contextMenu &&
              cellData.find(
                (cd) => cd.date === contextMenu.date && !cd.phaseId
              )?.isMilestone
                ? alpha(theme.palette.warning.main, 0.1)
                : "transparent",
            "&:hover": {
              backgroundColor: alpha(theme.palette.warning.main, 0.15),
            },
          }}
        >
          <FlagIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              color:
                contextMenu &&
                cellData.find(
                  (cd) => cd.date === contextMenu.date && !cd.phaseId
                )?.isMilestone
                  ? theme.palette.warning.main
                  : theme.palette.text.secondary,
            }}
          />
          <span>
            {contextMenu &&
            cellData.find(
              (cd) => cd.date === contextMenu.date && !cd.phaseId
            )?.isMilestone
              ? "Quitar Milestone"
              : "Marcar como Milestone"}
          </span>
        </MenuItem>
      </Menu>
    </>
  );
}
