/**
 * Component Type Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Component Types
 */

import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Alert, useTheme, alpha, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useComponentTypes,
  useCreateComponentType,
  useUpdateComponentType,
  useDeleteComponentType,
} from "../api/hooks/useComponentTypes";
import type { ComponentType } from "../api/services/componentTypes.service";
import { ComponentTypeCard, ComponentTypeEditDialog } from "@/features/componentType/components";

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
    try {
      await deleteMutation.mutateAsync(typeId);
    } catch (error) {
      console.error('Error deleting component type:', error);
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
            Error al cargar los Component Types: {error instanceof Error ? error.message : 'Error desconocido'}
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
          startIcon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
          onClick={handleAddType}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.24)}`,
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.32)}`,
            },
          }}
        >
          Add Component Type
        </Button>
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            viewMode === "grid"
              ? {
                  xs: "1fr",
                  sm: "repeat(auto-fill, minmax(280px, 1fr))",
                  md: "repeat(auto-fill, minmax(300px, 1fr))",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)",
                }
              : "1fr",
          gap: 3,
          pb: 2,
        }}
      >
        {filteredAndSortedTypes.length === 0 ? (
          <Box
            sx={{
              gridColumn: "1 / -1",
              py: 12,
              px: 3,
              textAlign: "center",
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: "1rem",
                fontWeight: 600,
                color: theme.palette.text.secondary,
                mb: 1,
              }}
            >
              {componentTypes.length === 0 ? "No component types found" : "No component types found"}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: "0.875rem",
                color: theme.palette.text.disabled,
              }}
            >
              {searchQuery 
                ? "Try adjusting your search criteria."
                : "Create your first component type to get started."}
            </Typography>
          </Box>
        ) : (
          filteredAndSortedTypes.map((type) => (
            <ComponentTypeCard
              key={type.id}
              componentType={type}
              onEdit={() => handleEditType(type)}
              onDelete={() => handleDeleteType(type.id)}
            />
          ))
        )}
      </Box>

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

