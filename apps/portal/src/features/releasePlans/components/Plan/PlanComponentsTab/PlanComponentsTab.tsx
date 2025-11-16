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
          Por favor seleccione un producto en el tab de Datos Comunes para gestionar los componentes.
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
      }}
    >
      <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: theme.palette.text.primary,
            }}
          >
            Componentes para {productName} ({planComponentsWithDetails.length})
          </Typography>
          <Tooltip title="Agregar componentes del producto" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => setSelectDialogOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                minHeight: 28,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Agregar
            </Button>
          </Tooltip>
        </Box>

        {/* Components Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {planComponentsWithDetails.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography 
                variant="body2"
                sx={{ fontSize: "0.8125rem" }}
              >
                No hay componentes agregados a este plan. Haz clic en "Agregar" para
                seleccionar componentes del producto.
              </Typography>
            </Box>
          ) : (
            <Box
              component="table"
              sx={{ width: "100%", borderCollapse: "collapse" }}
            >
              <Box component="thead">
                <Box
                  component="tr"
                  sx={{
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.5
                    )}`,
                  }}
                >
                  <Box
                    component="th"
                    sx={{
                      textAlign: "left",
                      p: 1.5,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: theme.palette.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Component
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      textAlign: "left",
                      p: 1.5,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: theme.palette.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Type
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      textAlign: "left",
                      p: 1.5,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: theme.palette.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Current Version
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      textAlign: "left",
                      p: 1.5,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: theme.palette.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Final Version
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      textAlign: "right",
                      p: 1.5,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: theme.palette.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Actions
                  </Box>
                </Box>
              </Box>
              <Box component="tbody">
                {planComponentsWithDetails.map((component) => (
                  <Box
                    key={component.id}
                    component="tr"
                    sx={{
                      borderBottom: `1px solid ${alpha(
                        theme.palette.divider,
                        0.3
                      )}`,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.action.hover, 0.3),
                      },
                    }}
                  >
                    <Box component="td" sx={{ p: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {component.name}
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          textTransform: "capitalize",
                        }}
                      >
                        {component.type}
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {component.currentVersion || "N/A"}
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {component.finalVersion}
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ p: 1.5, textAlign: "right" }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Tooltip title="Edit final version" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleEditVersion(component)}
                            sx={{
                              color: alpha(theme.palette.text.secondary, 0.7),
                              "&:hover": {
                                color: theme.palette.primary.main,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                              },
                              "&:focus-visible": {
                                outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                outlineOffset: 2,
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove component" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeleteComponent(component.planComponentId)
                            }
                            sx={{
                              color: alpha(theme.palette.text.secondary, 0.7),
                              "&:hover": {
                                color: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.08),
                              },
                              "&:focus-visible": {
                                outline: `2px solid ${alpha(theme.palette.error.main, 0.5)}`,
                                outlineOffset: 2,
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
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
