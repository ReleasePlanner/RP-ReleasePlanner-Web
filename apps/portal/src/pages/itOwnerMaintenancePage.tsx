/**
 * IT Owner Maintenance Page
 *
 * Elegant, Material UI compliant page for managing IT Owners
 */

import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Alert } from "@mui/material";
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
          }}
        >
          Add IT Owner
        </Button>
      }
    >
      <Box
        sx={{
          display: viewMode === "grid" ? "grid" : "flex",
          flexDirection: viewMode === "list" ? "column" : undefined,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {filteredAndSortedOwners.map((owner) => (
          <ITOwnerCard
            key={owner.id}
            owner={owner}
            onEdit={() => handleEditOwner(owner)}
            onDelete={() => handleDeleteOwner(owner.id)}
          />
        ))}
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
