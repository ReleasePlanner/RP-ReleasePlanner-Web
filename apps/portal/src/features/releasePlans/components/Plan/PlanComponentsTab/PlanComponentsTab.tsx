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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { ComponentVersion } from "@/features/releasePlans/components/Plan/CommonDataCard";
import type { PlanComponent } from "@/features/releasePlans/types";
import { SelectComponentsDialog } from "./SelectComponentsDialog";
import { ComponentVersionEditDialog } from "./ComponentVersionEditDialog";
import { useAppSelector } from "@/store/hooks";

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

  // Get components from Redux store (product maintenance)
  const products = useAppSelector((state) => state.products.products);
  const product = products.find((p) => p.id === productId);
  const productName = product?.name || "";
  const productComponents = product?.components || [];

  // Get full component details for components in the plan
  const planComponentsWithDetails = useMemo(() => {
    return components
      .map((planComp) => {
        const component = productComponents.find(
          (c) => c.id === planComp.componentId
        );
        return component
          ? {
              ...component,
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
    setEditingComponent({
      componentId: component.planComponentId,
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
      onComponentsChange(
        components.map((c) =>
          c.componentId === updatedComponent.componentId ? updatedComponent : c
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

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
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
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Components for {productName} ({planComponentsWithDetails.length})
          </Typography>
          <Tooltip title="Add components from product" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setSelectDialogOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 500,
                px: 1.75,
                py: 0.625,
                borderRadius: 1,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Add Components
            </Button>
          </Tooltip>
        </Box>

        {/* Components Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {planComponentsWithDetails.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                No components added to this plan yet. Click "Add Components" to
                select components from the product.
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
                        {component.version || "N/A"}
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
          planComponentsWithDetails.find(
            (c) => c.planComponentId === editingComponent?.componentId
          )?.version || ""
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
