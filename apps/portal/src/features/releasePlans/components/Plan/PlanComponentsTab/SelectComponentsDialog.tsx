import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import { useProducts } from "@/api/hooks";
import type { ComponentVersion } from "@/api/services/products.service";
import type { PlanComponent } from "@/features/releasePlans/types";

export type SelectComponentsDialogProps = {
  open: boolean;
  productId?: string;
  selectedComponentIds: string[];
  onClose: () => void;
  onAddComponents: (components: PlanComponent[]) => void;
};

type SortBy = "name" | "type" | "version";

export function SelectComponentsDialog({
  open,
  productId,
  selectedComponentIds,
  onClose,
  onAddComponents,
}: SelectComponentsDialogProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [finalVersions, setFinalVersions] = useState<Record<string, string>>({});
  const [versionErrors, setVersionErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Get products from API (Products maintenance) - same as PlanLeftPane
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  
  // Get product from API
  const selectedProduct = useMemo(() => {
    if (!productId) return null;
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);

  // Get all components for the product from API (Products maintenance)
  const allProductComponents = useMemo(() => {
    return selectedProduct?.components || [];
  }, [selectedProduct?.components]);

  // Filter out components already in the plan
  const availableComponents = useMemo(() => {
    return allProductComponents.filter(
      (c: ComponentVersion) => !selectedComponentIds.includes(c.id)
    );
  }, [allProductComponents, selectedComponentIds]);

  // Filter by search query
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return availableComponents;
    const query = searchQuery.toLowerCase();
    return availableComponents.filter(
      (c: ComponentVersion) =>
        c.name?.toLowerCase().includes(query) ||
        c.type?.toLowerCase().includes(query) ||
        (c.currentVersion && c.currentVersion.toLowerCase().includes(query))
    );
  }, [availableComponents, searchQuery]);

  // Sort components
  const processedComponents = useMemo(() => {
    const sorted = [...filteredComponents];
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "type":
        sorted.sort((a, b) => (a.type || "").localeCompare(b.type || ""));
        break;
      case "version":
        sorted.sort((a, b) => (a.currentVersion || "").localeCompare(b.currentVersion || ""));
        break;
    }
    return sorted;
  }, [filteredComponents, sortBy]);

  /**
   * Normalizes version to full format for comparison: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
   * Examples: "1" -> "1.0.0.0", "1.2" -> "1.2.0.0", "1.2.3" -> "1.2.3.0", "1.2.3.4" -> "1.2.3.4"
   */
  const normalizeVersion = (version: string): string => {
    if (!version || version.trim().length === 0) return "0.0.0.0";
    const parts = version.trim().split(".").map((p) => parseInt(p, 10) || 0);
    while (parts.length < 4) {
      parts.push(0);
    }
    return parts.slice(0, 4).join(".");
  };

  /**
   * Increments version by 1 in the patch position (MAJOR.SUBVERSION.MINOR.PATCH)
   * Example: "1.0.0.0" -> "1.0.0.1", "1.2.3.4" -> "1.2.3.5"
   */
  const incrementVersion = (version: string): string => {
    const normalized = normalizeVersion(version);
    const parts = normalized.split(".").map((p) => parseInt(p, 10));
    parts[3] = (parts[3] || 0) + 1; // Increment patch version
    return parts.join(".");
  };

  const handleToggleComponent = (
    componentId: string,
    currentVersion: string
  ) => {
    const isCurrentlySelected = selectedIds.includes(componentId);
    
    setSelectedIds((prev) =>
      isCurrentlySelected
        ? prev.filter((id) => id !== componentId)
        : [...prev, componentId]
    );
    
    // Set default final version when selecting
    if (!isCurrentlySelected) {
      // Set default to incremented version (currentVersion + 1 in patch)
      const defaultFinalVersion = currentVersion 
        ? incrementVersion(currentVersion)
        : "1.0.0.0";
      
      setFinalVersions((prev) => ({
        ...prev,
        [componentId]: defaultFinalVersion,
      }));
      
      // Clear any existing error for this component
      if (versionErrors[componentId]) {
        setVersionErrors((prev) => {
          const updated = { ...prev };
          delete updated[componentId];
          return updated;
        });
      }
    } else {
      // Remove version when deselecting
      setFinalVersions((prev) => {
        const updated = { ...prev };
        delete updated[componentId];
        return updated;
      });
      // Clear error when deselecting
      if (versionErrors[componentId]) {
        setVersionErrors((prev) => {
          const updated = { ...prev };
          delete updated[componentId];
          return updated;
        });
      }
    }
  };

  const handleVersionChange = (componentId: string, version: string) => {
    setFinalVersions((prev) => ({
      ...prev,
      [componentId]: version,
    }));
    
    // Clear error for this component when user starts typing
    if (versionErrors[componentId]) {
      setVersionErrors((prev) => {
        const updated = { ...prev };
        delete updated[componentId];
        return updated;
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === processedComponents.length) {
      setSelectedIds([]);
      setFinalVersions({});
      setVersionErrors({});
    } else {
      const allIds = processedComponents.map((c: ComponentVersion) => c.id);
      setSelectedIds(allIds);
      const versions: Record<string, string> = {};
      processedComponents.forEach((c: ComponentVersion) => {
        // Set default to incremented version (currentVersion + 1 in patch)
        const defaultFinalVersion = c.currentVersion 
          ? incrementVersion(c.currentVersion)
          : "1.0.0.0";
        versions[c.id] = defaultFinalVersion;
      });
      setFinalVersions(versions);
      setVersionErrors({}); // Clear errors when selecting all
    }
  };

  /**
   * Compares two semantic versions
   * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
   */
  const compareVersions = (v1: string, v2: string): number => {
    const normalized1 = normalizeVersion(v1);
    const normalized2 = normalizeVersion(v2);
    const parts1 = normalized1.split(".").map((p) => parseInt(p, 10));
    const parts2 = normalized2.split(".").map((p) => parseInt(p, 10));

    for (let i = 0; i < 4; i++) {
      if (parts1[i] < parts2[i]) return -1;
      if (parts1[i] > parts2[i]) return 1;
    }
    return 0;
  };

  const handleAdd = () => {
    if (selectedIds.length === 0) return;

    // Validate that all final versions are greater than current versions
    const errors: Record<string, string> = {};
    const invalidComponents: string[] = [];

    selectedIds.forEach((id) => {
      const component = allProductComponents.find((c) => c.id === id);
      if (!component) return;

      const finalVersion = finalVersions[id] || component.currentVersion || "";
      const currentVersion = component.currentVersion || "";

      if (!finalVersion || finalVersion.trim().length === 0) {
        errors[id] = "La versión final es requerida";
        invalidComponents.push(component.name || id);
        return;
      }

      const comparison = compareVersions(finalVersion, currentVersion);
      if (comparison <= 0) {
        errors[id] = `La versión final debe ser mayor que la versión actual (${currentVersion})`;
        invalidComponents.push(component.name || id);
      }
    });

    // If there are validation errors, show them and don't add components
    if (Object.keys(errors).length > 0) {
      setVersionErrors(errors);
      const errorMessage = invalidComponents.length === 1
        ? `La versión final del componente "${invalidComponents[0]}" debe ser mayor que la versión actual.`
        : `Las versiones finales de los siguientes componentes deben ser mayores que sus versiones actuales: ${invalidComponents.join(", ")}`;
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      return;
    }

    // Clear errors and add components
    setVersionErrors({});
    const componentsToAdd: PlanComponent[] = selectedIds.map((id) => {
      const component = allProductComponents.find((c) => c.id === id);
      return {
        componentId: id,
        currentVersion: component?.currentVersion || "0.0.0.0", // Current version from product
        finalVersion: finalVersions[id] || "",
      };
    });
    onAddComponents(componentsToAdd);
    setSelectedIds([]);
    setFinalVersions({});
    setSearchQuery("");
  };

  const handleClose = () => {
    setSelectedIds([]);
    setFinalVersions({});
    setVersionErrors({});
    setSearchQuery("");
    setSnackbarOpen(false);
    setSnackbarMessage("");
    onClose();
  };

  const isAllSelected =
    processedComponents.length > 0 &&
    selectedIds.length === processedComponents.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < processedComponents.length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "85vh",
          maxHeight: 900,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Seleccionar Componentes
          </Typography>
          {selectedIds.length > 0 && (
            <Chip
              label={`${selectedIds.length} seleccionado${selectedIds.length !== 1 ? "s" : ""}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {/* Product Display */}
        {productId && (
          <Box
            sx={{
              px: 2,
              pt: 2,
              pb: 1.5,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Producto:
              </Typography>
              {selectedProduct?.name ? (
                <Chip
                  label={selectedProduct.name}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    backgroundColor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    "& .MuiChip-label": {
                      px: 1.5,
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.875rem",
                    fontStyle: "italic",
                  }}
                >
                  Producto no encontrado
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Toolbar */}
        <Box
          sx={{
            px: 2,
            pb: 1.5,
            pt: selectedProduct ? 1.5 : 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* Search and Sort Row */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <TextField
              id="select-components-search-input"
              name="componentsSearch"
              size="small"
              placeholder="Buscar componentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                flex: { xs: "1 1 100%", sm: "0 1 280px" },
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />

            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="components-sort-label">Ordenar por</InputLabel>
              <Select
                id="select-components-sort-select"
                name="componentsSort"
                labelId="components-sort-label"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                label="Ordenar por"
                sx={{
                  borderRadius: 1.5,
                }}
              >
                <MenuItem value="name">Nombre</MenuItem>
                <MenuItem value="type">Tipo</MenuItem>
                <MenuItem value="version">Versión</MenuItem>
              </Select>
            </FormControl>

            {/* Select All */}
            {processedComponents.length > 0 && (
              <Button
                size="small"
                onClick={handleSelectAll}
                startIcon={
                  isAllSelected ? <CheckBox /> : <CheckBoxOutlineBlank />
                }
                sx={{ 
                  textTransform: "none",
                  borderRadius: 1.5,
                  ml: "auto",
                }}
              >
                {isAllSelected ? "Deseleccionar todos" : "Seleccionar todos"}
              </Button>
            )}
          </Box>
        </Box>

        {/* Components Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {isLoadingProducts ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">Cargando componentes...</Typography>
            </Box>
          ) : !productId ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                Por favor seleccione un producto en el tab de Datos Comunes para ver los componentes disponibles.
              </Typography>
            </Box>
          ) : processedComponents.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                {searchQuery
                  ? "No se encontraron componentes que coincidan con la búsqueda."
                  : "No hay componentes disponibles para agregar."}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      padding="checkbox" 
                      sx={{ 
                        width: 50,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      <Checkbox
                        id="select-all-components-checkbox"
                        name="selectAllComponents"
                        indeterminate={isSomeSelected}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        size="small"
                        disabled={processedComponents.length === 0}
                      />
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Componente
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Tipo
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Versión Actual
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Versión Final
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedComponents.map((component: ComponentVersion) => {
                    const isSelected = selectedIds.includes(component.id);
                    return (
                      <TableRow
                        key={component.id}
                        hover
                        onClick={() =>
                          handleToggleComponent(
                            component.id,
                            component.currentVersion || ""
                          )
                        }
                        sx={{
                          cursor: "pointer",
                          backgroundColor: isSelected
                            ? alpha(theme.palette.primary.main, 0.08)
                            : "transparent",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? alpha(theme.palette.primary.main, 0.12)
                              : alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            id={`component-checkbox-${component.id}`}
                            name={`component-${component.id}`}
                            checked={isSelected}
                            onChange={() =>
                              handleToggleComponent(
                                component.id,
                                component.currentVersion || ""
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={component.name || ""} arrow>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isSelected ? 600 : 400,
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {component.name || "-"}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {component.type || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {component.currentVersion || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <TextField
                            id={`component-version-input-${component.id}`}
                            name={`componentVersion-${component.id}`}
                            size="small"
                            value={
                              finalVersions[component.id] ||
                              component.currentVersion ||
                              ""
                            }
                            onChange={(e) =>
                              handleVersionChange(component.id, e.target.value)
                            }
                            placeholder="e.g., 1.0.0"
                            disabled={!isSelected}
                            error={!!versionErrors[component.id]}
                            helperText={versionErrors[component.id]}
                            sx={{
                              width: 120,
                              "& .MuiInputBase-input": {
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          gap: 1,
        }}
      >
        <Button 
          onClick={handleClose}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            px: 2,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={selectedIds.length === 0}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            px: 3,
            fontWeight: 500,
          }}
        >
          Agregar {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
        </Button>
      </DialogActions>

      {/* Snackbar for validation errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
