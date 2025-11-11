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
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import { useAppSelector } from "@/store/hooks";
import type { PlanComponent } from "@/features/releasePlans/types";
import type { ComponentVersion } from "@/features/releasePlans/components/Plan/CommonDataCard";

export type SelectComponentsDialogProps = {
  open: boolean;
  productId?: string;
  selectedComponentIds: string[];
  onClose: () => void;
  onAddComponents: (components: PlanComponent[]) => void;
};

export function SelectComponentsDialog({
  open,
  productId,
  selectedComponentIds,
  onClose,
  onAddComponents,
}: SelectComponentsDialogProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [finalVersions, setFinalVersions] = useState<Record<string, string>>(
    {}
  );

  // Get all components for the product from Redux store
  const products = useAppSelector((state) => state.products.products);
  const product = products.find((p) => p.id === productId);

  // Memoize allProductComponents to avoid React hooks warning
  const allProductComponents = useMemo(() => {
    return product?.components || [];
  }, [product?.components]);

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
        c.name.toLowerCase().includes(query) ||
        c.type.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
    );
  }, [availableComponents, searchQuery]);

  const handleToggleComponent = (
    componentId: string,
    currentVersion: string
  ) => {
    setSelectedIds((prev) =>
      prev.includes(componentId)
        ? prev.filter((id) => id !== componentId)
        : [...prev, componentId]
    );

    // Set default final version to current version when selecting
    if (!selectedIds.includes(componentId)) {
      setFinalVersions((prev) => ({
        ...prev,
        [componentId]: currentVersion || "",
      }));
    } else {
      // Remove version when deselecting
      setFinalVersions((prev) => {
        const updated = { ...prev };
        delete updated[componentId];
        return updated;
      });
    }
  };

  const handleVersionChange = (componentId: string, version: string) => {
    setFinalVersions((prev) => ({
      ...prev,
      [componentId]: version,
    }));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredComponents.length) {
      setSelectedIds([]);
      setFinalVersions({});
    } else {
      const allIds = filteredComponents.map((c: ComponentVersion) => c.id);
      setSelectedIds(allIds);
      const versions: Record<string, string> = {};
      filteredComponents.forEach((c: ComponentVersion) => {
        versions[c.id] = c.version || "";
      });
      setFinalVersions(versions);
    }
  };

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      const componentsToAdd: PlanComponent[] = selectedIds.map((id) => ({
        componentId: id,
        finalVersion: finalVersions[id] || "",
      }));
      onAddComponents(componentsToAdd);
      setSelectedIds([]);
      setFinalVersions({});
      setSearchQuery("");
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setFinalVersions({});
    setSearchQuery("");
    onClose();
  };

  const isAllSelected =
    filteredComponents.length > 0 &&
    selectedIds.length === filteredComponents.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < filteredComponents.length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: "80vh",
          maxHeight: 800,
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div">
            Select Components to Add
          </Typography>
          {selectedIds.length > 0 && (
            <Typography variant="body2" color="primary">
              {selectedIds.length} selected
            </Typography>
          )}
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ p: 0, display: "flex", flexDirection: "column" }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              flex: { xs: "1 1 100%", sm: "0 1 250px" },
              minWidth: 200,
            }}
          />

          {/* Select All */}
          {filteredComponents.length > 0 && (
            <Button
              size="small"
              onClick={handleSelectAll}
              startIcon={
                isAllSelected ? <CheckBox /> : <CheckBoxOutlineBlank />
              }
              sx={{ textTransform: "none" }}
            >
              {isAllSelected ? "Deselect All" : "Select All"}
            </Button>
          )}
        </Box>

        {/* Components Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {filteredComponents.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                {searchQuery
                  ? "No components match your search."
                  : "No available components to add."}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ width: 50 }}>
                      <Checkbox
                        indeterminate={isSomeSelected}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Component</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Current Version
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Final Version
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredComponents.map((component: ComponentVersion) => {
                    const isSelected = selectedIds.includes(component.id);
                    return (
                      <TableRow
                        key={component.id}
                        hover
                        onClick={() =>
                          handleToggleComponent(
                            component.id,
                            component.version || ""
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
                            checked={isSelected}
                            onChange={() =>
                              handleToggleComponent(
                                component.id,
                                component.version || ""
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={component.name} arrow>
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
                              {component.name}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {component.type}
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
                            {component.version || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <TextField
                            size="small"
                            value={
                              finalVersions[component.id] ||
                              component.version ||
                              ""
                            }
                            onChange={(e) =>
                              handleVersionChange(component.id, e.target.value)
                            }
                            placeholder="e.g., 1.0.0"
                            disabled={!isSelected}
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
        }}
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={selectedIds.length === 0}
        >
          Add {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
