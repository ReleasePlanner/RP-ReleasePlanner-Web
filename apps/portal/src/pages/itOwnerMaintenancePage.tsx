/**
 * IT Owner Maintenance Page
 *
 * Elegant, Material UI compliant page for managing IT Owners
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
  useITOwners,
  useCreateITOwner,
  useUpdateITOwner,
  useDeleteITOwner,
} from "../api/hooks";
import type { ITOwner } from "../api/services/itOwners.service";
import { ITOwnerEditDialog } from "@/features/itOwner/components";

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
    if (!window.confirm("Are you sure you want to delete this IT Owner?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(ownerId);
    } catch (error) {
      console.error('Error deleting IT owner:', error);
      alert("Error deleting IT Owner. Please try again.");
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
            Error loading IT Owners: {error instanceof Error ? error.message : 'Unknown error'}
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
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={handleAddOwner}
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
          Add IT Owner
        </Button>
      }
    >
      {/* IT Owners List - Compact and Minimalist */}
      {filteredAndSortedOwners.length === 0 ? (
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
            {itOwners.length === 0 ? "No IT owners configured" : "No IT owners found"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {itOwners.length === 0
              ? "Start by adding your first IT owner"
              : searchQuery
              ? "Try adjusting your search criteria."
              : "No IT owners match your filters."}
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
          {filteredAndSortedOwners.map((owner, index) => (
            <Box key={owner.id}>
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
                {/* Owner Info */}
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
                    {owner.name}
                  </Typography>
                  {owner.email && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.6875rem",
                        color: theme.palette.text.secondary,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mb: 0.5,
                      }}
                    >
                      {owner.email}
                    </Typography>
                  )}
                  {owner.department && (
                    <Chip
                      label={owner.department}
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
                      }}
                    />
                  )}
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
                  <Tooltip title="Edit IT Owner">
                    <IconButton
                      size="small"
                      onClick={() => handleEditOwner(owner)}
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
                  <Tooltip title="Delete IT Owner">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteOwner(owner.id)}
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
              {index < filteredAndSortedOwners.length - 1 && (
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
              )}
            </Box>
          ))}
        </Paper>
      )}

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
