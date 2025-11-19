import { useMemo, useState } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  useTheme, 
  alpha, 
  CircularProgress, 
  Alert,
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

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ product });
    setSelectedProduct(null);
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    }
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
              .map((c: ComponentVersion) => {
                // Get componentTypeId - required field
                let componentTypeId = (c as any).componentTypeId || (c as any).componentType?.id;
                
                // If no componentTypeId but we have a type code, try to find the ComponentType by code/name
                if (!componentTypeId && c.type) {
                  const foundType = componentTypes.find(
                    (ct) => ct.code?.toLowerCase() === c.type?.toLowerCase() || 
                            ct.name?.toLowerCase() === c.type?.toLowerCase()
                  );
                  if (foundType) {
                    componentTypeId = foundType.id;
                  }
                }
                
                if (!componentTypeId) {
                  console.error('handleDeleteComponent - Missing componentTypeId for component:', c);
                  throw new Error(`Component type is required. Component "${(c as any).name || c.type || 'unknown'}" is missing componentTypeId.`);
                }
                
                return {
                  // Only include id if it's a valid UUID (from database)
                  ...(c.id && isValidUUID(c.id) && { id: c.id }),
                  componentTypeId: componentTypeId,
                  name: (c as any).name || '',
                  currentVersion: c.currentVersion,
                  previousVersion: c.previousVersion,
                };
              }),
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
        type: "", // Don't set default type - let user select from ComponentType dropdown
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

  const handleSaveComponent = async (updatedComponent?: ComponentVersion) => {
    // Use updatedComponent if provided (from dialog), otherwise use editingProduct.component
    const componentToSave = updatedComponent || editingProduct?.component;
    if (!componentToSave) return;

    const product = selectedProduct || editingProduct.product;
    const existingProduct = products.find((p) => p.id === product.id);

    if (!existingProduct) return;

    try {
      const editingComponentId = componentToSave.id;
      
      // Map component data - handle both version formats
      const componentData = componentToSave as any;
      
      // Check if component exists by comparing valid UUIDs only
      const componentExists = editingComponentId && 
        isValidUUID(editingComponentId) &&
        existingProduct.components.some(
          (c: ComponentVersion) => c.id && isValidUUID(c.id) && c.id === editingComponentId
        );
      
      // Get currentVersion - prefer version field (from dialog), then currentVersion, then fallback
      // The dialog uses 'version' field which should be used as the new currentVersion
      let currentVersion = componentData.version || componentData.currentVersion || '';
      
      // For new components, currentVersion is required
      if (!componentExists) {
        if (!currentVersion || currentVersion.trim() === '') {
          console.error('Missing currentVersion for new component', { componentData });
          throw new Error('Component currentVersion is required. Please enter a Current Version in the dialog.');
        }
      } else {
        // For existing components, if version is empty, use existing currentVersion
        if (!currentVersion || currentVersion.trim() === '') {
          const existingComp = existingProduct.components.find((c: ComponentVersion) => c.id === editingComponentId);
          currentVersion = existingComp?.currentVersion || '';
          if (!currentVersion || currentVersion.trim() === '') {
            console.error('Missing currentVersion for existing component', { editingComponentId, existingComp });
            throw new Error('Component currentVersion is required');
          }
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

      // Get component type - prefer componentData.type, fallback to existing component type
      let componentType = componentData.type || '';
      let componentTypeId = (componentData as any).componentTypeId;
      
      if (componentExists) {
        const existingComp = existingProduct.components.find((c: ComponentVersion) => c.id === editingComponentId);
        if (existingComp) {
          // If type is not provided, use existing component type
          if (!componentType) {
            componentType = existingComp.type || '';
          }
          // If componentTypeId is not provided, use existing componentTypeId
          if (!componentTypeId) {
            componentTypeId = (existingComp as any).componentTypeId;
          }
        }
      }
      
      // Normalize type to lowercase to match enum values (web, services, mobile)
      if (componentType) {
        componentType = componentType.toLowerCase();
        // Map 'service' to 'services' to match enum values
        if (componentType === 'service') {
          componentType = 'services';
        }
      }
      
      // Ensure we have at least type or componentTypeId
      if (!componentType && !componentTypeId) {
        console.error('Missing component type', { componentData, componentExists, componentType, componentTypeId });
        throw new Error('Component type is required. Please select a Component Type in the dialog.');
      }
      
      // Ensure name is present
      if (!componentData.name || componentData.name.trim() === '') {
        console.error('Missing component name', { componentData });
        throw new Error('Component name is required. Please enter a Component Name in the dialog.');
      }

      const updatedComponents = componentExists
        ? existingProduct.components.map((c: ComponentVersion) =>
            c.id === editingComponentId
              ? {
                  ...c,
                  name: componentData.name || c.name, // Include name if provided
                  type: componentType || c.type, // Ensure type is always present
                  currentVersion: currentVersion,
                  previousVersion: previousVersion || c.previousVersion, // Preserve previousVersion if not provided
                  componentTypeId: componentTypeId || (c as any).componentTypeId,
                }
              : c
          )
        : [
            ...existingProduct.components,
            {
              // Don't include id for new components (backend will generate it)
              name: componentData.name || '', // Include name for new components
              type: componentType, // Ensure type is always present
              currentVersion: currentVersion, // Ensure currentVersion is set
              previousVersion: previousVersion, // Ensure previousVersion is set
              componentTypeId: componentTypeId,
              // Also include version field for compatibility with dialog format
              version: currentVersion,
            } as ComponentVersion,
          ];

      // Log the components being sent to backend for debugging
      console.log('handleSaveComponent - updatedComponents before mapping:', updatedComponents);
      
      const componentsPayload = updatedComponents.map((c: ComponentVersion) => {
        // Get currentVersion - prefer currentVersion, fallback to version field
        const compCurrentVersion = c.currentVersion || (c as any).version || '';
        // Get previousVersion - prefer previousVersion, fallback to currentVersion
        const compPreviousVersion = c.previousVersion || compCurrentVersion || '';
        
        // Get componentTypeId - required field
        let componentTypeId = (c as any).componentTypeId || (c as any).componentType?.id;
        
        // If no componentTypeId but we have a type code, try to find the ComponentType by code/name
        if (!componentTypeId && c.type) {
          const foundType = componentTypes.find(
            (ct) => ct.code?.toLowerCase() === c.type?.toLowerCase() || 
                    ct.name?.toLowerCase() === c.type?.toLowerCase()
          );
          if (foundType) {
            componentTypeId = foundType.id;
          }
        }
        
        // Validate that componentTypeId is present
        if (!componentTypeId || !isValidUUID(componentTypeId)) {
          console.error('handleSaveComponent - Missing componentTypeId for component:', {
            id: c.id,
            name: (c as any).name,
            type: c.type,
            componentTypeId: (c as any).componentTypeId,
            componentType: (c as any).componentType,
          });
          throw new Error(`Component type is required. Component "${(c as any).name || c.type || 'unknown'}" is missing componentTypeId.`);
        }
        
        console.log('handleSaveComponent - mapping component:', {
          id: c.id,
          name: (c as any).name,
          type: c.type,
          componentTypeId,
          currentVersion: c.currentVersion,
          version: (c as any).version,
          compCurrentVersion,
          previousVersion: c.previousVersion,
          compPreviousVersion,
        });
        
        const componentPayload: any = {
          name: (c as any).name || '', // Include name in payload
          componentTypeId: componentTypeId, // Required field
          currentVersion: compCurrentVersion, // Use normalized currentVersion
          previousVersion: compPreviousVersion, // Use normalized previousVersion
        };
        
        // Only include id if it's a valid UUID (from database)
        if (c.id && isValidUUID(c.id)) {
          componentPayload.id = c.id;
        }
        
        console.log('handleSaveComponent - componentPayload:', componentPayload);
        return componentPayload;
      });
      
      console.log('handleSaveComponent - componentsPayload:', componentsPayload);
      
      const result = await updateMutation.mutateAsync({
        id: product.id,
        data: {
          components: componentsPayload,
        },
      });
      
      console.log('handleSaveComponent - update result:', result);

      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving component:', error);
      // Show error to user
      const errorMessage = error?.message || error?.response?.data?.message || 'Error saving component. Please try again.';
      alert(errorMessage); // TODO: Replace with proper notification system
      // Don't close dialog on error so user can fix and retry
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
            Error loading products: {error instanceof Error ? error.message : 'Unknown error'}
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
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={handleAddProduct}
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
          Add Product
        </Button>
      }
    >
      {/* Products List - Compact and Minimalist */}
      {filteredAndSortedProducts.length === 0 ? (
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
            {products.length === 0 ? "No products configured" : "No products found"}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {products.length === 0 
              ? "Start by adding your first product"
              : searchQuery 
              ? "Try adjusting your search criteria."
              : "No products match your filters."}
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
          {filteredAndSortedProducts.map((product, index) => (
            <Box key={product.id}>
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
                {/* Product Info */}
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
                    {product.name}
                  </Typography>
                  {product.description && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.6875rem",
                        color: theme.palette.text.secondary,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.description}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip
                      label={`${product.components.length} component${
                        product.components.length !== 1 ? "s" : ""
                      }`}
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
                  </Stack>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
                  <Tooltip title="Edit product">
                    <IconButton
                      size="small"
                      onClick={() => handleEditProduct(product)}
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
                  <Tooltip title="Delete product">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteProduct(product.id)}
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
              {index < filteredAndSortedProducts.length - 1 && (
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
              )}
            </Box>
          ))}
        </Paper>
      )}

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