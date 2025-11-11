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
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import type { PlanReference, PlanReferenceType } from "../../../types";
import { ReferenceEditDialog } from "./ReferenceEditDialog";

export type PlanReferencesTabProps = {
  references?: PlanReference[];
  onReferencesChange?: (references: PlanReference[]) => void;
};

export function PlanReferencesTab({
  references = [],
  onReferencesChange,
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
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
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
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                "&:hover": {
                  boxShadow: theme.shadows[2],
                  borderColor: alpha(theme.palette.primary.main, 0.3),
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
                        reference.type === "document") &&
                        reference.url && (
                          <IconButton
                            size="small"
                            onClick={() => handleOpenLink(reference.url)}
                            sx={{
                              color: theme.palette.primary.main,
                              "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        )}
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(reference)}
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(reference.id)}
                        sx={{
                          color: theme.palette.error.main,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                  </Stack>

                  {(reference.description || reference.url) && (
                    <>
                      <Divider sx={{ my: 0.5 }} />
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
