/**
 * Feature Category Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Feature Categories
 */

import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Alert, useTheme, alpha, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useFeatureCategories,
  useCreateFeatureCategory,
  useUpdateFeatureCategory,
  useDeleteFeatureCategory,
} from "../api/hooks/useFeatureCategories";
import type { FeatureCategory } from "../api/services/featureCategories.service";
import { FeatureCategoryCard, FeatureCategoryEditDialog } from "@/features/featureCategory/components";

export function FeatureCategoryMaintenancePage() {
  const theme = useTheme();
  
  // API hooks
  const { data: categories = [], isLoading, error } = useFeatureCategories();
  const createMutation = useCreateFeatureCategory();
  const updateMutation = useUpdateFeatureCategory();
  const deleteMutation = useDeleteFeatureCategory();

  const [editingCategory, setEditingCategory] = useState<FeatureCategory | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let result = [...categories];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [categories, searchQuery, sortBy]);

  const handleAddCategory = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as FeatureCategory);
    setOpenDialog(true);
  };

  const handleEditCategory = (category: FeatureCategory) => {
    setEditingCategory(category);
    setOpenDialog(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error('Error deleting feature category:', error);
    }
  };

  const handleSave = async () => {
    if (!editingCategory) return;

    try {
      const existingCategory = categories.find((c) => c.id === editingCategory.id);
      if (existingCategory && !existingCategory.id.startsWith('cat-')) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: {
            name: editingCategory.name,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingCategory.name,
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving feature category:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Feature Category Maintenance" description="Manage Feature Categories">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout title="Feature Category Maintenance" description="Manage Feature Categories">
        <Box p={3}>
          <Alert severity="error">
            Error al cargar las Feature Categories: {error instanceof Error ? error.message : 'Error desconocido'}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Feature Category Maintenance"
      description="Manage Feature Categories"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search categories..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
          onClick={handleAddCategory}
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
          Add Category
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
        {filteredAndSortedCategories.length === 0 ? (
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
              {categories.length === 0 ? "No categories found" : "No categories found"}
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
                : "Create your first category to get started."}
            </Typography>
          </Box>
        ) : (
          filteredAndSortedCategories.map((category) => (
            <FeatureCategoryCard
              key={category.id}
              category={category}
              onEdit={() => handleEditCategory(category)}
              onDelete={() => handleDeleteCategory(category.id)}
            />
          ))
        )}
      </Box>

      {editingCategory && (
        <FeatureCategoryEditDialog
          open={openDialog}
          category={editingCategory}
          onSave={handleSave}
          onClose={handleCloseDialog}
          onCategoryChange={setEditingCategory}
        />
      )}
    </PageLayout>
  );
}
export default FeatureCategoryMaintenancePage;

