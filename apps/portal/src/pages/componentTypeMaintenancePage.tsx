/**
 * Component Type Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Component Types
 */

import { useMemo, useState } from "react";
import { 
  Box, 
  Button, 
  CircularProgress, 
  Alert, 
  useTheme, 
  alpha, 
  Typography,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Chip,
} from "@mui/material";
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useComponentTypes,
  useCreateComponentType,
  useUpdateComponentType,
  useDeleteComponentType,
} from "../api/hooks/useComponentTypes";
import type { ComponentType } from "../api/services/componentTypes.service";
import { ComponentTypeEditDialog } from "@/features/componentType/components";

export function ComponentTypeMaintenancePage() {
  const theme = useTheme();
  
  // API hooks
  const { data: componentTypes = [], isLoading, error } = useComponentTypes();
  const createMutation = useCreateComponentType();
  const updateMutation = useUpdateComponentType();
  const deleteMutation = useDeleteComponentType();

  const [editingType, setEditingType] = useState<ComponentType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort component types
  const filteredAndSortedTypes = useMemo(() => {
    let result = [...componentTypes];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter(
        (type) =>
          type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [componentTypes, searchQuery, sortBy]);

  const handleAddType = () => {
    setEditingType({
      id: `type-${Date.now()}`,
      name: "",
      code: "",
      description: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ComponentType);
    setOpenDialog(true);
  };

  const handleEditType = (type: ComponentType) => {
    setEditingType(type);
    setOpenDialog(true);
  };

  const handleDeleteType = async (typeId: string) => {
    if (!window.confirm("Are you sure you want to delete this component type?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(typeId);
    } catch (error) {
      console.error('Error deleting component type:', error);
      alert("Error deleting component type. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!editingType) return;

    try {
      const existingType = componentTypes.find((t) => t.id === editingType.id);
      if (existingType) {
        await updateMutation.mutateAsync({
          id: editingType.id,
          data: {
            name: editingType.name,
            code: editingType.code,
            description: editingType.description,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingType.name,
          code: editingType.code || undefined,
          description: editingType.description || undefined,
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving component type:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingType(null);
  };

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Component Type Maintenance" description="Manage Component Types">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout title="Component Type Maintenance" description="Manage Component Types">
        <Box p={3}>
          <Alert severity="error">
            Error loading component types: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Component Type Maintenance"
      description="Manage Component Types"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search component types..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={handleAddType}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            px: 2,
            py: 0.75,
            boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
            "&:hover": {
              boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
        >
          Add Component Type
        </Button>
      }
    >
      {/* Component Types List - Compact and Minimalist */}
      {filteredAndSortedTypes.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              mb: 0.5,
            }}
          >
            {componentTypes.length === 0 ? "No component types configured" : "No component types found"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {componentTypes.length === 0
              ? "Start by adding your first component type"
              : searchQuery
              ? "Try adjusting your search criteria."
              : "No component types match your filters."}
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {filteredAndSortedTypes.map((type, index) => (
            <Box key={type.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  transition: theme.transitions.create(["background-color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                {/* Component Type Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      mb: 0.25,
                    }}
                  >
                    {type.name}
                  </Typography>
                  {type.code && (
                    <Chip
                      label={type.code}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.625rem",
                        fontWeight: 500,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        "& .MuiChip-label": {
                          px: 0.75,
                        },
                        mb: 0.5,
                      }}
                    />
                  )}
                  {type.description && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.6875rem",
                        color: theme.palette.text.secondary,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {type.description}
                    </Typography>
                  )}
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
                  <Tooltip title="Edit Component Type">
                    <IconButton
                      size="small"
                      onClick={() => handleEditType(type)}
                      sx={{
                        fontSize: 16,
                        p: 0.75,
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Component Type">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteType(type.id)}
                      disabled={deleteMutation.isPending}
                      sx={{
                        fontSize: 16,
                        p: 0.75,
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                        },
                      }}
                    >
                      {deleteMutation.isPending ? (
                        <CircularProgress size={14} />
                      ) : (
                        <DeleteIcon fontSize="inherit" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              {index < filteredAndSortedTypes.length - 1 && (
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
              )}
            </Box>
          ))}
        </Paper>
      )}

      {editingType && (
        <ComponentTypeEditDialog
          open={openDialog}
          componentType={editingType}
          onSave={handleSave}
          onClose={handleCloseDialog}
          onComponentTypeChange={setEditingType}
        />
      )}
    </PageLayout>
  );
}
export default ComponentTypeMaintenancePage;

