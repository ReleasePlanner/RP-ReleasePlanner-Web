import { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Link as LinkIcon,
  Description as DocumentIcon,
  Note as NoteIcon,
  Comment as CommentIcon,
  AttachFile as FileIcon,
  Flag as MilestoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import type { PlanReference, PlanReferenceType } from "../../../types";
import { ReferenceEditDialog } from "./ReferenceEditDialog";

export type PlanReferencesTabProps = {
  references?: PlanReference[];
  onReferencesChange?: (references: PlanReference[]) => void;
  onScrollToDate?: (date: string) => void;
};

export function PlanReferencesTab({
  references = [],
  onReferencesChange,
  onScrollToDate,
}: PlanReferencesTabProps) {
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReference, setEditingReference] =
    useState<PlanReference | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getTypeIcon = (type: PlanReferenceType) => {
    switch (type) {
      case "link":
        return <LinkIcon sx={{ fontSize: 18 }} />;
      case "document":
        return <DocumentIcon sx={{ fontSize: 18 }} />;
      case "note":
        return <NoteIcon sx={{ fontSize: 18 }} />;
      case "comment":
        return <CommentIcon sx={{ fontSize: 18 }} />;
      case "file":
        return <FileIcon sx={{ fontSize: 18 }} />;
      case "milestone":
        return <MilestoneIcon sx={{ fontSize: 18 }} />;
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
        onReferencesChange([...references, reference]);
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
        p: 2,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
          References
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            textTransform: "none",
            fontSize: "0.8125rem",
            fontWeight: 500,
            px: 1.75,
            py: 0.625,
            borderRadius: 1,
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          Add Reference
        </Button>
      </Stack>

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
            <NoteIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            <Typography variant="body2">No references added yet</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Add links, documents, or notes related to this plan
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={1.5} sx={{ overflow: "auto", flex: 1 }}>
          {references.map((reference) => (
            <Card
              key={reference.id}
              onClick={(e) => {
                // Prevent click propagation to avoid triggering parent handlers
                e.stopPropagation();
                // When clicking on a reference with a date, scroll to that date
                if (
                  reference.date &&
                  typeof reference.date === "string" &&
                  reference.date.trim() !== "" &&
                  onScrollToDate
                ) {
                  onScrollToDate(reference.date);
                }
              }}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                cursor: reference.date ? "pointer" : "default",
                "&:hover": {
                  boxShadow: theme.shadows[2],
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  backgroundColor: reference.date
                    ? alpha(theme.palette.primary.main, 0.02)
                    : undefined,
                },
                transition: "all 0.2s ease",
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flex={1}
                    >
                      <Chip
                        icon={getTypeIcon(reference.type)}
                        label={
                          reference.type.charAt(0).toUpperCase() +
                          reference.type.slice(1)
                        }
                        size="small"
                        sx={{
                          bgcolor: alpha(getTypeColor(reference.type), 0.1),
                          color: getTypeColor(reference.type),
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 24,
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          flex: 1,
                        }}
                      >
                        {reference.title}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      {(reference.type === "link" ||
                        reference.type === "document" ||
                        reference.type === "file") &&
                        reference.url && (
                          <IconButton
                            size="small"
                            onClick={() => handleOpenLink(reference.url)}
                            sx={{
                              color: alpha(theme.palette.primary.main, 0.7),
                              "&:hover": {
                                color: theme.palette.primary.main,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                              },
                              "&:focus-visible": {
                                outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                outlineOffset: 2,
                              },
                            }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        )}
                      {/* Only show edit/delete for plan-level references (not auto-generated) */}
                      {!reference.date && !reference.phaseId && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(reference)}
                            sx={{
                              color: alpha(theme.palette.text.secondary, 0.7),
                              "&:hover": {
                                color: theme.palette.primary.main,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                              },
                              "&:focus-visible": {
                                outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                outlineOffset: 2,
                              },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(reference.id)}
                            sx={{
                              color: alpha(theme.palette.error.main, 0.7),
                              "&:hover": {
                                color: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.08),
                              },
                              "&:focus-visible": {
                                outline: `2px solid ${alpha(theme.palette.error.main, 0.5)}`,
                                outlineOffset: 2,
                              },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </Stack>

                  {(reference.date || reference.description || reference.url) && (
                    <>
                      <Divider sx={{ my: 0.5 }} />
                      {reference.date && (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.75rem",
                            mb: reference.description || reference.url ? 0.5 : 0,
                          }}
                        >
                          <CalendarIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                            {reference.phaseId ? (
                              <>
                                <TimelineIcon sx={{ fontSize: 12, mx: 0.5 }} />
                                Celda: {reference.date}
                              </>
                            ) : (
                              <>Día: {reference.date}</>
                            )}
                          </Typography>
                        </Stack>
                      )}
                      {reference.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.8rem",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {reference.description}
                        </Typography>
                      )}
                      {reference.url && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.75rem",
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                          }}
                        >
                          {reference.url}
                        </Typography>
                      )}
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

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
      />
    </Box>
  );
}
