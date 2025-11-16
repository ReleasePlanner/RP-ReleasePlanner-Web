import { useMemo, useState } from "react";
import { Box, Button, Typography, useTheme, alpha, CircularProgress, Alert } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import {
  ProductCard,
  ComponentEditDialog,
} from "@/features/product/components";
import { ProductEditDialog } from "@/features/product/components/ProductEditDialog";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../api/hooks";
import { useComponentTypes } from "../api/hooks/useComponentTypes";
import type {
  Product,
  ComponentVersion,
} from "../api/services/products.service";

interface EditingProduct {
  product: Product;
  component?: ComponentVersion;
}

export function ProductMaintenancePage() {
  const theme = useTheme();
  const { data: componentTypes = [] } = useComponentTypes();
  
  // API hooks
  const { data: products = [], isLoading, error } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to check if a string is a valid UUID
  const isValidUUID = (str: string | undefined): boolean => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const handleAddProduct = () => {
    setEditingProduct({
      product: {
        id: `prod-${Date.now()}`,
        name: "",
        description: "",
        components: [],
        features: [],
      },
    });
    setSelectedProduct(null);
    setOpenProductDialog(true);
  };

  const handleEditComponent = (
    product: Product,
    component: ComponentVersion
  ) => {
    setSelectedProduct(product);
    // Map backend component format to dialog format
    // Backend has: type, currentVersion, previousVersion, componentTypeId (if available)
    // Dialog expects: name, type, version, description, componentTypeId
    let componentTypeId = (component as any).componentTypeId || (component as any).componentType?.id;
    
    // If no componentTypeId but we have a type code, try to find the ComponentType by code
    if (!componentTypeId && component.type) {
      const foundType = componentTypes.find(
        (ct) => ct.code?.toLowerCase() === component.type?.toLowerCase() || 
                ct.name?.toLowerCase() === component.type?.toLowerCase()
      );
      if (foundType) {
        componentTypeId = foundType.id;
      }
    }
    
    const mappedComponent = {
      ...component,
      name: component.name || component.type || '', // Use name if exists, fallback to type
      type: component.type || '',
      version: component.currentVersion || component.version || '', // Map currentVersion to version
      description: component.description || '',
      componentTypeId: componentTypeId,
    };
    setEditingProduct({ product, component: mappedComponent as any });
    setOpenDialog(true);
  };

  const handleDeleteComponent = async (productId: string, componentId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      try {
        await updateMutation.mutateAsync({
          id: productId,
          data: {
            components: product.components
              .filter((c: ComponentVersion) => c.id !== componentId)
              .map((c: ComponentVersion) => ({
                // Only include id if it's a valid UUID (from database)
                ...(c.id && isValidUUID(c.id) && { id: c.id }),
                type: c.type,
                currentVersion: c.currentVersion,
                previousVersion: c.previousVersion,
              })),
          },
        });
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    }
  };

  const handleAddComponent = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct({
      product,
      component: {
        id: `comp-${Date.now()}`,
        name: "",
        type: "web",
        version: "",
        description: "",
      } as any,
    });
    setOpenDialog(true);
  };

  const handleSaveProduct = async (product: Product) => {
    if (!product.name.trim()) return;

    try {
      const existingProduct = products.find((p) => p.id === product.id);
      if (existingProduct) {
        await updateMutation.mutateAsync({
          id: product.id,
          data: {
            name: product.name,
            components: product.components?.map((c: ComponentVersion) => ({
              // Only include id if it's a valid UUID (from database)
              ...(c.id && isValidUUID(c.id) && { id: c.id }),
              type: c.type,
              currentVersion: c.currentVersion,
              previousVersion: c.previousVersion,
            })),
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: product.name,
          components: product.components?.map((c: ComponentVersion) => ({
            type: c.type,
            currentVersion: c.currentVersion,
            previousVersion: c.previousVersion,
          })),
        });
      }
      handleCloseProductDialog();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleSaveComponent = async () => {
    if (!editingProduct || !editingProduct.component) return;

    const product = selectedProduct || editingProduct.product;
    const existingProduct = products.find((p) => p.id === product.id);

    if (!existingProduct) return;

    try {
      const editingComponentId = editingProduct.component.id;
      
      // Map component data - handle both version formats
      const componentData = editingProduct.component as any;
      
      // Check if component exists by comparing valid UUIDs only
      const componentExists = editingComponentId && 
        isValidUUID(editingComponentId) &&
        existingProduct.components.some(
          (c: ComponentVersion) => c.id && isValidUUID(c.id) && c.id === editingComponentId
        );
      
      // Get currentVersion - prefer version field (from dialog), then currentVersion, then fallback
      // The dialog uses 'version' field which should be used as the new currentVersion
      let currentVersion = componentData.version || componentData.currentVersion || '';
      
      // For new components, if version is still empty, throw error
      if (!currentVersion && !componentExists) {
        // This shouldn't happen if dialog validation works, but add defensive check
        console.error('Missing currentVersion for new component');
        throw new Error('Component currentVersion is required. Please enter a Current Version.');
      }
      
      // For existing components, if version is empty, use existing currentVersion
      if (!currentVersion && componentExists) {
        const existingComp = existingProduct.components.find((c: ComponentVersion) => c.id === editingComponentId);
        currentVersion = existingComp?.currentVersion || '';
        if (!currentVersion) {
          console.error('Missing currentVersion for existing component');
          throw new Error('Component currentVersion is required');
        }
      }
      
      // Determine previousVersion
      let previousVersion = componentData.previousVersion || '';
      
      if (componentExists) {
        const existingComp = existingProduct.components.find((c: ComponentVersion) => c.id === editingComponentId);
        if (existingComp) {
          // If version changed, use old currentVersion as previousVersion
          if (currentVersion && existingComp.currentVersion !== currentVersion) {
            previousVersion = existingComp.currentVersion || '';
          } else if (!previousVersion) {
            // Otherwise preserve existing previousVersion
            previousVersion = existingComp.previousVersion || '';
          }
        }
      } else {
        // For new components, if previousVersion is empty, use currentVersion
        if (!previousVersion) {
          previousVersion = currentVersion; // For new components, previousVersion defaults to currentVersion
        }
      }
      
      // Final validation
      if (!currentVersion) {
        console.error('Missing currentVersion');
        throw new Error('Component currentVersion is required');
      }
      
      // Ensure previousVersion is not empty (backend requires it)
      if (!previousVersion) {
        previousVersion = currentVersion; // Fallback to currentVersion
      }

      const updatedComponents = componentExists
        ? existingProduct.components.map((c: ComponentVersion) =>
            c.id === editingComponentId
              ? {
                  ...c,
                  name: componentData.name || c.name, // Include name if provided
                  type: componentData.type,
                  currentVersion: currentVersion,
                  previousVersion: previousVersion || c.previousVersion, // Preserve previousVersion if not provided
                  componentTypeId: (componentData as any).componentTypeId || (c as any).componentTypeId,
                }
              : c
          )
        : [
            ...existingProduct.components,
            {
              // Don't include id for new components (backend will generate it)
              name: componentData.name || '', // Include name for new components
              type: componentData.type,
              currentVersion: currentVersion,
              previousVersion: previousVersion,
              componentTypeId: (componentData as any).componentTypeId,
            },
          ];

      await updateMutation.mutateAsync({
        id: product.id,
        data: {
          components: updatedComponents.map((c: ComponentVersion) => {
            const componentPayload: any = {
              name: (c as any).name || '', // Include name in payload
              currentVersion: c.currentVersion,
              previousVersion: c.previousVersion,
            };
            // Prefer componentTypeId if available, otherwise use type (normalized to lowercase)
            if ((c as any).componentTypeId && isValidUUID((c as any).componentTypeId)) {
              componentPayload.componentTypeId = (c as any).componentTypeId;
            } else if (c.type) {
              // Normalize type to lowercase for backend compatibility
              componentPayload.type = c.type.toLowerCase(); // Fallback to enum type for backward compatibility
            }
            // Only include id if it's a valid UUID (from database)
            if (c.id && isValidUUID(c.id)) {
              componentPayload.id = c.id;
            }
            return componentPayload;
          }),
        },
      });

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving component:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  // Determine if editing: component exists and has a valid UUID (from database)
  const isEditing = editingProduct?.component !== undefined && 
    editingProduct.component.id && 
    isValidUUID(editingProduct.component.id);

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "date", label: "Sort: Date" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Product Maintenance" description="Manage products and their component versions">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout title="Product Maintenance" description="Manage products and their component versions">
        <Box p={3}>
          <Alert severity="error">
            Error al cargar los productos: {error instanceof Error ? error.message : 'Error desconocido'}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Product Maintenance"
      description="Manage products and their component versions"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search products..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 1,
            boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
            "&:hover": {
              boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
        >
          Add Product
        </Button>
      }
    >
      {/* Products Grid/List */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            viewMode === "grid"
              ? {
                  xs: "1fr",
                  sm: "repeat(auto-fill, minmax(420px, 1fr))",
                  md: "repeat(auto-fill, minmax(450px, 1fr))",
                  lg: "repeat(2, 1fr)",
                  xl: "repeat(3, 1fr)",
                }
              : "1fr",
          gap: 3,
          pb: 2,
        }}
      >
        {filteredAndSortedProducts.length === 0 ? (
          <Box
            sx={{
              gridColumn: "1 / -1",
              py: 12,
              px: 3,
              textAlign: "center",
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: "1rem",
                fontWeight: 600,
                color: theme.palette.text.secondary,
                mb: 1,
              }}
            >
              No products found
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: "0.875rem",
                color: theme.palette.text.disabled,
              }}
            >
              {searchQuery 
                ? "Try adjusting your search criteria."
                : "Create your first product to get started."}
            </Typography>
          </Box>
        ) : (
          filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEditComponent={handleEditComponent}
              onDeleteComponent={handleDeleteComponent}
              onAddComponent={handleAddComponent}
            />
          ))
        )}
      </Box>

      {/* Product Edit Dialog */}
      <ProductEditDialog
        open={openProductDialog}
        product={editingProduct?.product || null}
        onClose={handleCloseProductDialog}
        onSave={handleSaveProduct}
        onProductChange={(product) => {
          if (editingProduct) {
            setEditingProduct({ product });
          }
        }}
      />

      {/* Component Edit Dialog */}
      <ComponentEditDialog
        open={openDialog}
        editing={isEditing}
        component={editingProduct?.component || null}
        selectedProductName={selectedProduct?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSaveComponent}
        onComponentChange={(component) => {
          if (editingProduct) {
            setEditingProduct({
              ...editingProduct,
              component,
            });
          }
        }}
      />
    </PageLayout>
  );
}

export default ProductMaintenancePage;