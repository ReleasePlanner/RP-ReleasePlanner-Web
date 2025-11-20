import { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Chip,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Link as LinkIcon,
  Description as DocumentIcon,
  Note as NoteIcon,
  Flag as MilestoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import type { PlanReference, PlanReferenceType, PlanPhase } from "../../../types";
import { ReferenceEditDialog } from "./ReferenceEditDialog";

export type PlanReferencesTabProps = {
  references?: PlanReference[];
  onReferencesChange?: (references: PlanReference[]) => void;
  onScrollToDate?: (date: string) => void;
  phases?: PlanPhase[];
  startDate?: string;
  endDate?: string;
  calendarIds?: string[];
};

export function PlanReferencesTab({
  references = [],
  onReferencesChange,
  onScrollToDate,
  phases = [],
  startDate,
  endDate,
  calendarIds = [],
}: PlanReferencesTabProps) {
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReference, setEditingReference] =
    useState<PlanReference | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getTypeIcon = (type: PlanReferenceType) => {
    switch (type) {
      case "link":
        return <LinkIcon sx={{ fontSize: 14 }} />;
        case "document":
        return <DocumentIcon sx={{ fontSize: 14 }} />;
        case "note":
        return <NoteIcon sx={{ fontSize: 14 }} />;
        case "milestone":
        return <MilestoneIcon sx={{ fontSize: 14 }} />;
    }
  };

  const getTypeColor = (type: PlanReferenceType) => {
    switch (type) {
      case "link":
        return theme.palette.info.main;
      case "document":
        return theme.palette.primary.main;
      case "note":
        return theme.palette.warning.main;
      case "comment":
        return theme.palette.info.main;
      case "file":
        return theme.palette.success.main;
      case "milestone":
        return theme.palette.error.main;
    }
  };

  const handleAdd = () => {
    setEditingReference(null);
    setIsCreating(true);
    setEditDialogOpen(true);
  };

  const handleEdit = (reference: PlanReference) => {
    setEditingReference(reference);
    setIsCreating(false);
    setEditDialogOpen(true);
  };

  const handleDelete = (referenceId: string) => {
    if (onReferencesChange) {
      onReferencesChange(references.filter((r) => r.id !== referenceId));
    }
  };

  const handleSave = (reference: PlanReference) => {
    if (onReferencesChange) {
      if (isCreating) {
        // Check if reference already exists (by ID or by content for milestones)
        const existsById = reference.id && references.some((r) => r.id === reference.id);
        const existsByContent = reference.type === "milestone" && reference.date
          ? references.some((r) => 
              r.type === "milestone" && 
              r.date === reference.date && 
              r.phaseId === reference.phaseId
            )
          : false;
        
        if (!existsById && !existsByContent) {
          onReferencesChange([...references, reference]);
        }
      } else {
        onReferencesChange(
          references.map((r) => (r.id === reference.id ? reference : r))
        );
      }
    }
    setEditDialogOpen(false);
    setEditingReference(null);
    setIsCreating(false);
  };

  const handleOpenLink = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 1.5, sm: 2 },
        overflow: "hidden",
      }}
    >
      <Stack spacing={1} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
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
            References ({references.length})
          </Typography>
          <Tooltip title="Add reference" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={handleAdd}
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

        {/* References List */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: "hidden", 
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {references.length === 0 ? (
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
                  <NoteIcon sx={{ fontSize: 20, color: theme.palette.primary.main, opacity: 0.6 }} />
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
          ) : (
            <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              <Paper
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {references.map((reference, index) => (
                  <Box key={reference.id || `ref-${Math.random()}`}>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          reference.date &&
                          typeof reference.date === "string" &&
                          reference.date.trim() !== "" &&
                          onScrollToDate
                        ) {
                          onScrollToDate(reference.date);
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleEdit(reference);
                      }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenLink(reference.url);
                              }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(reference);
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(reference.id);
                                }}
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
                            label={
                              reference.type === "link" ? "Link" :
                              reference.type === "document" ? "Document" :
                              reference.type === "note" ? "Note" :
                              "Milestone"
                            }
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
                                      <TimelineIcon sx={{ fontSize: 8, mx: 0.25, verticalAlign: "middle" }} />
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
                    {index < references.length - 1 && (
                      <Box
                        sx={{
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Paper>
            </Box>
          )}
        </Box>
      </Stack>

      <ReferenceEditDialog
        open={editDialogOpen}
        reference={editingReference}
        isCreating={isCreating}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingReference(null);
          setIsCreating(false);
        }}
        onSave={handleSave}
        phases={phases}
        startDate={startDate}
        endDate={endDate}
        calendarIds={calendarIds}
      />
    </Box>
  );
}

// Force Vite cache refresh - PlanReferencesTab updated with Tooltip imports
