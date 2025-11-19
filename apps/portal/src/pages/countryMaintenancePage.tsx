/**
 * Country Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Countries
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
  useCountries,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
} from "../api/hooks/useCountries";
import type { Country } from "../api/services/countries.service";
import { CountryEditDialog } from "@/features/country/components";

export function CountryMaintenancePage() {
  const theme = useTheme();
  
  // API hooks
  const { data: countries = [], isLoading, error } = useCountries();
  const createMutation = useCreateCountry();
  const updateMutation = useUpdateCountry();
  const deleteMutation = useDeleteCountry();

  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort countries
  const filteredAndSortedCountries = useMemo(() => {
    let result = [...countries];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (country.region && country.region.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "code") {
      result.sort((a, b) => a.code.localeCompare(b.code));
    } else if (sortBy === "region") {
      result.sort((a, b) => {
        const regionA = a.region || "";
        const regionB = b.region || "";
        return regionA.localeCompare(regionB);
      });
    }

    return result;
  }, [countries, searchQuery, sortBy]);

  const handleAddCountry = () => {
    setEditingCountry({
      id: `country-${Date.now()}`,
      name: "",
      code: "",
      isoCode: "",
      region: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Country);
    setOpenDialog(true);
  };

  const handleEditCountry = (country: Country) => {
    setEditingCountry(country);
    setOpenDialog(true);
  };

  const handleDeleteCountry = async (countryId: string) => {
    if (!window.confirm("Are you sure you want to delete this country?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(countryId);
    } catch (error) {
      console.error('Error deleting country:', error);
      alert("Error deleting country. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!editingCountry) return;

    try {
      const existingCountry = countries.find((c) => c.id === editingCountry.id);
      if (existingCountry && !existingCountry.id.startsWith('country-')) {
        await updateMutation.mutateAsync({
          id: editingCountry.id,
          data: {
            name: editingCountry.name,
            code: editingCountry.code,
            isoCode: editingCountry.isoCode,
            region: editingCountry.region,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: editingCountry.name,
          code: editingCountry.code,
          isoCode: editingCountry.isoCode,
          region: editingCountry.region,
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving country:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCountry(null);
  };

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "code", label: "Sort: Code" },
    { value: "region", label: "Sort: Region" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Country Maintenance" description="Manage countries and regions">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout title="Country Maintenance" description="Manage countries and regions">
        <Box p={3}>
          <Alert severity="error">
            Error loading countries: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Country Maintenance"
      description="Manage countries and regions"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search countries..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={handleAddCountry}
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
          Add Country
        </Button>
      }
    >
      {/* Countries List - Compact and Minimalist */}
      {filteredAndSortedCountries.length === 0 ? (
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
            {countries.length === 0 ? "No countries configured" : "No countries found"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {countries.length === 0
              ? "Start by adding your first country"
              : searchQuery
              ? "Try adjusting your search criteria."
              : "No countries match your filters."}
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
          {filteredAndSortedCountries.map((country, index) => (
            <Box key={country.id}>
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
                {/* Country Info */}
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
                    {country.name}
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    <Chip
                      label={country.code}
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
                    {country.isoCode && (
                      <Chip
                        label={country.isoCode}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.625rem",
                          fontWeight: 500,
                          bgcolor: alpha(theme.palette.text.secondary, 0.1),
                          color: theme.palette.text.secondary,
                          "& .MuiChip-label": {
                            px: 0.75,
                          },
                        }}
                      />
                    )}
                    {country.region && (
                      <Chip
                        label={country.region}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.625rem",
                          fontWeight: 500,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          "& .MuiChip-label": {
                            px: 0.75,
                          },
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
                  <Tooltip title="Edit Country">
                    <IconButton
                      size="small"
                      onClick={() => handleEditCountry(country)}
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
                  <Tooltip title="Delete Country">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCountry(country.id)}
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
              {index < filteredAndSortedCountries.length - 1 && (
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
              )}
            </Box>
          ))}
        </Paper>
      )}

      {/* Edit Dialog */}
      <CountryEditDialog
        open={openDialog}
        country={editingCountry}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onCountryChange={(country: Country) => {
          setEditingCountry(country);
        }}
      />
    </PageLayout>
  );
}

export default CountryMaintenancePage;

