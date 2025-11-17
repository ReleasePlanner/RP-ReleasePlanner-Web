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
  
  // Debug: Log references received by PlanReferencesTab
  console.log('[PlanReferencesTab] Received references:', {
    references,
    referencesLength: references?.length,
    referencesType: typeof references,
    isArray: Array.isArray(references),
    firstReference: references?.[0],
  });
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
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5, pb: 1, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            fontSize: "0.8125rem",
            color: theme.palette.text.primary,
          }}
        >
          Referencias ({references.length})
        </Typography>
        <Tooltip title="Agregar referencia" arrow placement="top">
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={handleAdd}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 500,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              minHeight: 28,
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            Agregar
          </Button>
        </Tooltip>
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
          <Stack spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <NoteIcon sx={{ fontSize: 32, color: theme.palette.primary.main, opacity: 0.6 }} />
            </Box>
            <Typography 
              variant="body2"
              sx={{ 
                fontSize: "0.875rem",
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              No hay referencias agregadas aún
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.7, 
                fontSize: "0.75rem",
                maxWidth: 280,
                lineHeight: 1.5,
              }}
            >
              Agrega enlaces, documentos o notas relacionadas con este plan
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={1.25} sx={{ overflow: "auto", flex: 1 }}>
          {references.map((reference) => (
            <Box
              key={reference.id}
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
                // Allow editing all references (including milestones with date/phaseId)
                // Auto-generated references from cellData will be filtered out by handleEdit
                handleEdit(reference);
              }}
              sx={{
                p: { xs: 1.5, sm: 1.75 },
                borderRadius: 1.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                bgcolor: theme.palette.background.paper,
                cursor: "pointer",
                transition: theme.transitions.create(
                  ["border-color", "box-shadow", "background-color"],
                  {
                    duration: theme.transitions.duration.shorter,
                  }
                ),
                "&:hover": {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
                  bgcolor: reference.date
                    ? alpha(theme.palette.primary.main, 0.02)
                    : alpha(theme.palette.action.hover, 0.02),
                },
              }}
            >
              <Stack key={`main-stack-${reference.id}`} spacing={1.25}>
                {/* Header */}
                <Stack
                  key={`header-${reference.id}`}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1.5}
                >
                  <Stack
                    key={`header-content-${reference.id}`}
                    direction="row"
                    spacing={1.25}
                    alignItems="flex-start"
                    flex={1}
                    sx={{ minWidth: 0 }}
                  >
                    <Chip
                      icon={getTypeIcon(reference.type)}
                      label={
                        reference.type === "link" ? "Enlace" :
                        reference.type === "document" ? "Documento" :
                        reference.type === "note" ? "Nota" :
                        "Hito"
                      }
                      size="small"
                      sx={{
                        bgcolor: alpha(getTypeColor(reference.type), 0.1),
                        color: getTypeColor(reference.type),
                        fontWeight: 500,
                        fontSize: "0.6875rem",
                        height: 24,
                        flexShrink: 0,
                        "& .MuiChip-icon": {
                          fontSize: 16,
                          color: getTypeColor(reference.type),
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        flex: 1,
                        color: theme.palette.text.primary,
                        lineHeight: 1.4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {reference.title}
                    </Typography>
                  </Stack>
                  <Stack 
                    key={`actions-${reference.id}`}
                    direction="row" 
                    spacing={0.25} 
                    sx={{ flexShrink: 0 }}
                  >
                    {reference.type === "link" && reference.url && (
                        <Tooltip title="Abrir enlace" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLink(reference.url);
                            }}
                            sx={{
                              color: alpha(theme.palette.primary.main, 0.7),
                              "&:hover": {
                                color: theme.palette.primary.main,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                              },
                            }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    {!reference.date && !reference.phaseId && (
                      <Box key={`edit-delete-${reference.id}`} component="span">
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(reference);
                            }}
                            sx={{
                              color: alpha(theme.palette.text.secondary, 0.7),
                              "&:hover": {
                                color: theme.palette.primary.main,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                              },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(reference.id);
                            }}
                            sx={{
                              color: alpha(theme.palette.error.main, 0.7),
                              "&:hover": {
                                color: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.08),
                              },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Stack>
                </Stack>

                {/* Content */}
                {(reference.date || reference.description || reference.url) && (
                  <Stack key={`content-${reference.id}`} spacing={1}>
                    {reference.date && (
                      <Stack
                        key={`date-${reference.id}`}
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        sx={{
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <CalendarIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          {reference.phaseId ? (
                            <>
                              <TimelineIcon sx={{ fontSize: 14, mx: 0.5, verticalAlign: "middle" }} />
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
                        key={`description-${reference.id}`}
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.8125rem",
                          lineHeight: 1.6,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {reference.description}
                      </Typography>
                    )}
                    {reference.url && (
                      <Typography
                        key={`url-${reference.id}`}
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                          opacity: 0.8,
                          bgcolor: alpha(theme.palette.action.hover, 0.3),
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                        }}
                      >
                        {reference.url}
                      </Typography>
                    )}
                  </Stack>
                )}
              </Stack>
            </Box>
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
        phases={phases}
        startDate={startDate}
        endDate={endDate}
        calendarIds={calendarIds}
      />
    </Box>
  );
}

// Force Vite cache refresh - PlanReferencesTab updated with Tooltip imports
