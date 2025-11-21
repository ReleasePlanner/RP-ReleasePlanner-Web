import { useState, useCallback, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import type { PlanComponent } from "../../../types";
import { SelectComponentsDialog } from "./SelectComponentsDialog";
import { ComponentVersionEditDialog } from "./ComponentVersionEditDialog/ComponentVersionEditDialog";
import {
  NoProductState,
  ComponentsLoadingState,
  ComponentsEmptyState,
  ComponentsHeader,
  ComponentsTable,
} from "./components";
import { usePlanComponents, usePlanComponentsStyles } from "./hooks";
import type { ComponentWithDetails } from "./hooks";

export type PlanComponentsTabProps = {
  readonly productId?: string;
  readonly components?: PlanComponent[];
  readonly onComponentsChange?: (components: PlanComponent[]) => void;
};

export function PlanComponentsTab({
  productId,
  components = [],
  onComponentsChange,
}: PlanComponentsTabProps) {
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] =
    useState<PlanComponent | null>(null);

  const { product, planComponentsWithDetails, isLoading } = usePlanComponents(
    productId,
    components
  );
  const styles = usePlanComponentsStyles();

  const handleAddComponents = useCallback(
    (newComponents: PlanComponent[]) => {
      if (onComponentsChange) {
        // Filter out duplicates - only add components that aren't already in the plan
        const existingIds = new Set(components.map((c) => c.componentId));
        const uniqueNewComponents = newComponents.filter(
          (c) => !existingIds.has(c.componentId)
        );
        if (uniqueNewComponents.length > 0) {
          onComponentsChange([...components, ...uniqueNewComponents]);
        }
      }
      setSelectDialogOpen(false);
    },
    [components, onComponentsChange]
  );

  const handleEditVersion = useCallback(
    (component: ComponentWithDetails) => {
      // Find the plan component to get currentVersion
      const planComp = components.find(
        (c) => c.componentId === component.planComponentId
      );
      setEditingComponent({
        componentId: component.planComponentId,
        currentVersion:
          planComp?.currentVersion || component.currentVersion || "0.0.0.0", // Preserve currentVersion from plan
        finalVersion: component.finalVersion,
      });
      setEditDialogOpen(true);
    },
    [components]
  );

  const handleDeleteComponent = useCallback(
    (componentId: string) => {
      if (onComponentsChange) {
        onComponentsChange(
          components.filter((c) => c.componentId !== componentId)
        );
      }
    },
    [components, onComponentsChange]
  );

  const handleSaveVersion = useCallback(
    (updatedComponent: PlanComponent) => {
      if (onComponentsChange) {
        // Preserve currentVersion when updating finalVersion
        onComponentsChange(
          components.map((c) =>
            c.componentId === updatedComponent.componentId
              ? {
                  ...updatedComponent,
                  currentVersion:
                    updatedComponent.currentVersion ||
                    c.currentVersion ||
                    "0.0.0.0", // Preserve currentVersion
                }
              : c
          )
        );
      }
      setEditDialogOpen(false);
      setEditingComponent(null);
    },
    [components, onComponentsChange]
  );

  const currentVersionForDialog = useMemo(() => {
    if (editingComponent?.currentVersion) {
      return editingComponent.currentVersion;
    }
    const found = planComponentsWithDetails.find(
      (c) => c.planComponentId === editingComponent?.componentId
    );
    return found?.currentVersion || "";
  }, [editingComponent, planComponentsWithDetails]);

  if (!productId) {
    return <NoProductState />;
  }

  if (isLoading && (!product || product.components.length === 0)) {
    return <ComponentsLoadingState />;
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
      <Stack
        spacing={1}
        sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <ComponentsHeader
          componentCount={planComponentsWithDetails.length}
          onAddClick={() => setSelectDialogOpen(true)}
          styles={styles}
        />

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
            <ComponentsEmptyState />
          ) : (
            <ComponentsTable
              components={planComponentsWithDetails}
              onEdit={handleEditVersion}
              onDelete={handleDeleteComponent}
              styles={styles}
            />
          )}
        </Box>
      </Stack>

      <SelectComponentsDialog
        open={selectDialogOpen}
        productId={productId}
        selectedComponentIds={components.map((c) => c.componentId)}
        onClose={() => setSelectDialogOpen(false)}
        onAddComponents={handleAddComponents}
      />

      <ComponentVersionEditDialog
        open={editDialogOpen}
        component={editingComponent}
        currentVersion={currentVersionForDialog}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingComponent(null);
        }}
        onSave={handleSaveVersion}
      />
    </Box>
  );
}
