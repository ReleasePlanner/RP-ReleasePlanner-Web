/**
 * Country Maintenance Page
 *
 * Elegant, Material UI compliant page for managing Countries
 */

import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Alert, useTheme, alpha, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  useCountries,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
} from "../api/hooks/useCountries";
import type { Country } from "../api/services/countries.service";
import { CountryCard, CountryEditDialog } from "@/features/country/components";

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
    try {
      await deleteMutation.mutateAsync(countryId);
    } catch (error) {
      console.error('Error deleting country:', error);
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

  return (
    <PageLayout>
      <PageToolbar
        title="Countries Maintenance"
        subtitle="Manage countries and regions"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "code", label: "Code" },
          { value: "region", label: "Region" },
        ]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCountry}
            sx={{
              textTransform: "none",
              px: 2.5,
              py: 1,
              borderRadius: 1.5,
              fontWeight: 600,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            Add Country
          </Button>
        }
      />

      {/* Main: Countries List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Failed to load countries. Please try again.</Alert>
        ) : filteredAndSortedCountries.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.secondary }}>
              {searchQuery ? "No countries found" : "No countries yet"}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by adding your first country"}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddCountry}
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.25,
                  borderRadius: 1.5,
                  fontWeight: 600,
                }}
              >
                Add Country
              </Button>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(280px, 1fr))",
                md: "repeat(auto-fill, minmax(300px, 1fr))",
                lg: "repeat(3, 1fr)",
                xl: "repeat(4, 1fr)",
              },
              gap: 3,
              pb: 2,
            }}
          >
            {filteredAndSortedCountries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                onEdit={() => handleEditCountry(country)}
                onDelete={() => handleDeleteCountry(country.id)}
              />
            ))}
          </Box>
        )}
      </Box>

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

