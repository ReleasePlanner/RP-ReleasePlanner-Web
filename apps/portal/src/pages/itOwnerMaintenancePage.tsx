/**
 * IT Owner Maintenance Page
 *
 * Elegant, Material UI compliant page for managing IT Owners
 */

import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Alert, useTheme, alpha, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useITOwners,
  useCreateITOwner,
  useUpdateITOwner,
  useDeleteITOwner,
} from "../api/hooks";
import type { ITOwner } from "../api/services/itOwners.service";
import { ITOwnerCard, ITOwnerEditDialog } from "@/features/itOwner/components";

export function ITOwnerMaintenancePage() {
  const theme = useTheme();
  
  // API hooks
  const { data: itOwners = [], isLoading, error } = useITOwners();
  const createMutation = useCreateITOwner();
  const updateMutation = useUpdateITOwner();
  const deleteMutation = useDeleteITOwner();

  const [editingOwner, setEditingOwner] = useState<ITOwner | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort IT owners
  const filteredAndSortedOwners = useMemo(() => {
    let result = [...itOwners];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter(
        (owner) =>
          owner.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [itOwners, searchQuery, sortBy]);

  const handleAddOwner = () => {
    setEditingOwner({
      id: `owner-${Date.now()}`,
      name: "",
    } as ITOwner);
    setOpenDialog(true);
  };

  const handleEditOwner = (owner: ITOwner) => {
    setEditingOwner(owner);
    setOpenDialog(true);
  };

  const handleDeleteOwner = async (ownerId: string) => {
    try {
      await deleteMutation.mutateAsync(ownerId);
    } catch (error) {
      console.error('Error deleting IT owner:', error);
    }
  };

  const handleSave = async () => {
    if (!editingOwner) return;

    try {
      const existingOwner = itOwners.find((o) => o.id === editingOwner.id);
      if (existingOwner) {
        await updateMutation.mutateAsync({
          id: editingOwner.id,
          data: {
            name: editingOwner.name,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingOwner.name,
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving IT owner:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOwner(null);
  };

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="IT Owner Maintenance" description="Manage IT Owners and their contact information">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout title="IT Owner Maintenance" description="Manage IT Owners and their contact information">
        <Box p={3}>
          <Alert severity="error">
            Error al cargar los IT Owners: {error instanceof Error ? error.message : 'Error desconocido'}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="IT Owner Maintenance"
      description="Manage IT Owners and their contact information"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search IT owners..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
          onClick={handleAddOwner}
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
          Add IT Owner
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
        {filteredAndSortedOwners.length === 0 ? (
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
              {itOwners.length === 0 ? "No IT owners found" : "No IT owners found"}
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
                : "Create your first IT owner to get started."}
            </Typography>
          </Box>
        ) : (
          filteredAndSortedOwners.map((owner) => (
            <ITOwnerCard
              key={owner.id}
              owner={owner}
              onEdit={() => handleEditOwner(owner)}
              onDelete={() => handleDeleteOwner(owner.id)}
            />
          ))
        )}
      </Box>

      {editingOwner && (
        <ITOwnerEditDialog
          open={openDialog}
          owner={editingOwner}
          onSave={handleSave}
          onClose={handleCloseDialog}
          onChange={setEditingOwner}
        />
      )}
    </PageLayout>
  );
}
export default ITOwnerMaintenancePage;
