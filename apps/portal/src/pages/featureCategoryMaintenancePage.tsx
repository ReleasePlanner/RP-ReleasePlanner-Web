/**
 * Feature Category Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Feature Categories
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
} from "@mui/material";
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useFeatureCategories,
  useCreateFeatureCategory,
  useUpdateFeatureCategory,
  useDeleteFeatureCategory,
} from "../api/hooks/useFeatureCategories";
import type { FeatureCategory } from "../api/services/featureCategories.service";
import { FeatureCategoryEditDialog } from "@/features/featureCategory/components";

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
    if (!window.confirm("Are you sure you want to delete this feature category?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error('Error deleting feature category:', error);
      alert("Error deleting feature category. Please try again.");
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
            Error loading feature categories: {error instanceof Error ? error.message : 'Unknown error'}
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
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={handleAddCategory}
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
          Add Category
        </Button>
      }
    >
      {/* Feature Categories List - Compact and Minimalist */}
      {filteredAndSortedCategories.length === 0 ? (
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
            {categories.length === 0 ? "No feature categories configured" : "No feature categories found"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {categories.length === 0
              ? "Start by adding your first feature category"
              : searchQuery
              ? "Try adjusting your search criteria."
              : "No feature categories match your filters."}
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
          {filteredAndSortedCategories.map((category, index) => (
            <Box key={category.id}>
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
                {/* Category Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {category.name}
                  </Typography>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
                  <Tooltip title="Edit Feature Category">
                    <IconButton
                      size="small"
                      onClick={() => handleEditCategory(category)}
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
                  <Tooltip title="Delete Feature Category">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCategory(category.id)}
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
              {index < filteredAndSortedCategories.length - 1 && (
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
              )}
            </Box>
          ))}
        </Paper>
      )}

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

