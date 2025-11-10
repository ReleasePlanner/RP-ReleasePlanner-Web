/**
 * IT Owner Maintenance Page
 *
 * Elegant, Material UI compliant page for managing IT Owners
 */

import { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addITOwner,
  updateITOwner,
  deleteITOwner,
} from "@/state/itOwnersSlice";
import type { ITOwner } from "@/features/releasePlans/constants/itOwners";
import { ITOwnerCard, ITOwnerEditDialog } from "@/features/itOwner/components";

export function ITOwnerMaintenancePage() {
  const dispatch = useAppDispatch();
  const itOwners = useAppSelector((state) => state.itOwners.itOwners);

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
          owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (owner.email &&
            owner.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "email") {
      result.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
    }

    return result;
  }, [itOwners, searchQuery, sortBy]);

  const handleAddOwner = () => {
    setEditingOwner({
      id: `owner-${Date.now()}`,
      name: "",
      email: "",
    });
    setOpenDialog(true);
  };

  const handleEditOwner = (owner: ITOwner) => {
    setEditingOwner(owner);
    setOpenDialog(true);
  };

  const handleDeleteOwner = (ownerId: string) => {
    dispatch(deleteITOwner(ownerId));
  };

  const handleSave = () => {
    if (!editingOwner) return;

    // Check if this is a new owner or an update
    const existingOwner = itOwners.find((o) => o.id === editingOwner.id);
    if (existingOwner) {
      dispatch(updateITOwner(editingOwner));
    } else {
      dispatch(addITOwner(editingOwner));
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOwner(null);
  };

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "email", label: "Sort: Email" },
  ];

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
          startIcon={<AddIcon />}
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
