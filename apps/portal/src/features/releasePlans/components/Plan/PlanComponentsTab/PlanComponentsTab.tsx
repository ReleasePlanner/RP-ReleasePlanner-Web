import { useState, useMemo } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { ComponentVersion } from "@/api/services/products.service";
import type { PlanComponent } from "@/features/releasePlans/types";
import { SelectComponentsDialog } from "./SelectComponentsDialog";
import { ComponentVersionEditDialog } from "./ComponentVersionEditDialog";
import { useProducts } from "@/api/hooks";

export type PlanComponentsTabProps = {
  productId?: string;
  components?: PlanComponent[];
  onComponentsChange?: (components: PlanComponent[]) => void;
};

export function PlanComponentsTab({
  productId,
  components = [],
  onComponentsChange,
}: PlanComponentsTabProps) {
  const theme = useTheme();
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] =
    useState<PlanComponent | null>(null);

  // Get products from API (Products maintenance) - same as PlanLeftPane
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  
  // Get product from API
  const product = useMemo(() => {
    if (!productId) return null;
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);
  
  const productName = product?.name || "";
  const productComponents = product?.components || [];

  // Get full component details for components in the plan
  // Use currentVersion from planComponent (stored in plan), not from product
  const planComponentsWithDetails = useMemo(() => {
    return components
      .map((planComp) => {
        const component = productComponents.find(
          (c) => c.id === planComp.componentId
        );
        return component
          ? {
              ...component,
              currentVersion: planComp.currentVersion || component.currentVersion || "0.0.0.0", // Use currentVersion from plan
              finalVersion: planComp.finalVersion,
              planComponentId: planComp.componentId,
            }
          : null;
      })
      .filter(
        (
          c
        ): c is ComponentVersion & {
          finalVersion: string;
          planComponentId: string;
        } => c !== null
      );
  }, [components, productComponents]);

  const handleAddComponents = (newComponents: PlanComponent[]) => {
    if (onComponentsChange) {
      // Filter out duplicates - only add components that aren't already in the plan
      const existingIds = components.map((c) => c.componentId);
      const uniqueNewComponents = newComponents.filter(
        (c) => !existingIds.includes(c.componentId)
      );
      if (uniqueNewComponents.length > 0) {
        onComponentsChange([...components, ...uniqueNewComponents]);
      }
    }
    setSelectDialogOpen(false);
  };

  const handleEditVersion = (
    component: ComponentVersion & {
      finalVersion: string;
      planComponentId: string;
    }
  ) => {
    // Find the plan component to get currentVersion
    const planComp = components.find((c) => c.componentId === component.planComponentId);
    setEditingComponent({
      componentId: component.planComponentId,
      currentVersion: planComp?.currentVersion || component.currentVersion || "0.0.0.0", // Preserve currentVersion from plan
      finalVersion: component.finalVersion,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteComponent = (componentId: string) => {
    if (onComponentsChange) {
      onComponentsChange(
        components.filter((c) => c.componentId !== componentId)
      );
    }
  };

  const handleSaveVersion = (updatedComponent: PlanComponent) => {
    if (onComponentsChange) {
      // Preserve currentVersion when updating finalVersion
      onComponentsChange(
        components.map((c) =>
          c.componentId === updatedComponent.componentId 
            ? { 
                ...updatedComponent, 
                currentVersion: updatedComponent.currentVersion || c.currentVersion || "0.0.0.0" // Preserve currentVersion
              } 
            : c
        )
      );
    }
    setEditDialogOpen(false);
    setEditingComponent(null);
  };

  if (!productId) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          Please select a product in the Common Data tab to manage components.
        </Typography>
      </Box>
    );
  }

  if (isLoadingProducts && productComponents.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack spacing={1} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            pb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            flexShrink: 0,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: "0.625rem", sm: "0.6875rem" },
              color: theme.palette.text.primary,
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
            }}
          >
            Components ({planComponentsWithDetails.length})
          </Typography>
          <Tooltip title="Add product components" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={() => setSelectDialogOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                fontWeight: 500,
                px: { xs: 1, sm: 1.25 },
                py: 0.5,
                borderRadius: 1,
                minHeight: 26,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                flexShrink: 0,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Add
            </Button>
          </Tooltip>
        </Box>

        {/* Components Table */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: "hidden", 
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {planComponentsWithDetails.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography 
                variant="body2"
                sx={{ fontSize: "0.6875rem" }}
              >
                No components added to this plan. Click "Add" to
                select components from the product.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: "auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
              <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  borderRadius: 2,
                  overflowX: "auto",
                  overflowY: "auto",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Table 
                  size="small" 
                  stickyHeader 
                  sx={{ 
                    width: "100%",
                    tableLayout: "auto",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                          py: { xs: 0.5, sm: 0.75 },
                          px: { xs: 0.25, sm: 0.5 },
                          whiteSpace: "nowrap",
                          letterSpacing: "0.02em",
                          textTransform: "uppercase",
                          backgroundColor: theme.palette.mode === "dark" 
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                          width: "auto",
                        }}
                      >
                        Actions
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                          py: { xs: 0.5, sm: 0.75 },
                          px: { xs: 0.5, sm: 0.75 },
                          whiteSpace: "nowrap",
                          letterSpacing: "0.02em",
                          textTransform: "uppercase",
                          backgroundColor: theme.palette.mode === "dark" 
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                        }}
                      >
                        Component
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                          py: { xs: 0.5, sm: 0.75 },
                          px: { xs: 0.5, sm: 0.75 },
                          whiteSpace: "nowrap",
                          letterSpacing: "0.02em",
                          textTransform: "uppercase",
                          backgroundColor: theme.palette.mode === "dark" 
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                          py: { xs: 0.5, sm: 0.75 },
                          px: { xs: 0.5, sm: 0.75 },
                          whiteSpace: "nowrap",
                          letterSpacing: "0.02em",
                          textTransform: "uppercase",
                          backgroundColor: theme.palette.mode === "dark" 
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                        }}
                      >
                        Current Version
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                          py: { xs: 0.5, sm: 0.75 },
                          px: { xs: 0.5, sm: 0.75 },
                          whiteSpace: "nowrap",
                          letterSpacing: "0.02em",
                          textTransform: "uppercase",
                          backgroundColor: theme.palette.mode === "dark" 
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                        }}
                      >
                        New Version
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {planComponentsWithDetails.map((component) => (
                      <TableRow
                        key={component.id}
                        sx={{
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                          transition: theme.transitions.create(["background-color"], {
                            duration: theme.transitions.duration.shorter,
                          }),
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.25, sm: 0.5 }, whiteSpace: "nowrap" }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.25,
                              alignItems: "center",
                              flexWrap: "nowrap",
                            }}
                          >
                            <Tooltip title="Edit new version" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={() => handleEditVersion(component)}
                                sx={{
                                  fontSize: { xs: 14, sm: 16 },
                                  p: { xs: 0.375, sm: 0.5 },
                                  color: theme.palette.text.secondary,
                                  transition: theme.transitions.create(["color", "background-color"], {
                                    duration: theme.transitions.duration.shorter,
                                  }),
                                  "&:hover": {
                                    color: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                  },
                                }}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete component" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleDeleteComponent(component.planComponentId)
                                }
                                sx={{
                                  fontSize: { xs: 14, sm: 16 },
                                  p: { xs: 0.375, sm: 0.5 },
                                  color: theme.palette.text.secondary,
                                  transition: theme.transitions.create(["color", "background-color"], {
                                    duration: theme.transitions.duration.shorter,
                                  }),
                                  "&:hover": {
                                    color: theme.palette.error.main,
                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 } }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                              color: theme.palette.text.primary,
                              lineHeight: 1.4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                            title={component.name}
                          >
                            {component.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 }, whiteSpace: "nowrap" }}>
                          <Chip
                            label={component.type}
                            size="small"
                            sx={{
                              height: { xs: 16, sm: 18 },
                              fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                              fontWeight: 500,
                              textTransform: "capitalize",
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              "& .MuiChip-label": {
                                px: { xs: 0.5, sm: 0.625 },
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 }, whiteSpace: "nowrap" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              color: theme.palette.text.secondary,
                              fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                              lineHeight: 1.4,
                            }}
                          >
                            {component.currentVersion || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 }, whiteSpace: "nowrap" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              fontWeight: component.finalVersion ? 600 : 400,
                              color: component.finalVersion 
                                ? theme.palette.primary.main 
                                : theme.palette.text.disabled,
                              fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                              fontStyle: component.finalVersion ? "normal" : "italic",
                              lineHeight: 1.4,
                            }}
                          >
                            {component.finalVersion || "Not set"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Stack>

      {/* Select Components Dialog */}
      <SelectComponentsDialog
        open={selectDialogOpen}
        productId={productId}
        selectedComponentIds={components.map((c) => c.componentId)}
        onClose={() => setSelectDialogOpen(false)}
        onAddComponents={handleAddComponents}
      />

      {/* Edit Version Dialog */}
      <ComponentVersionEditDialog
        open={editDialogOpen}
        component={editingComponent}
        currentVersion={
          editingComponent?.currentVersion || 
          planComponentsWithDetails.find(
            (c) => c.planComponentId === editingComponent?.componentId
          )?.currentVersion || ""
        }
        onClose={() => {
          setEditDialogOpen(false);
          setEditingComponent(null);
        }}
        onSave={handleSaveVersion}
      />
    </Box>
  );
}
