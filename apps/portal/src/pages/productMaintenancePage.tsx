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
    setEditingProduct({ product, component });
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
      },
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
      const componentExists = existingProduct.components.some(
        (c: ComponentVersion) => c.id === editingProduct.component?.id
      );

      const updatedComponents = componentExists
        ? existingProduct.components.map((c: ComponentVersion) =>
            c.id === editingProduct.component?.id
              ? {
                  ...c,
                  type: editingProduct.component.type,
                  currentVersion: editingProduct.component.currentVersion,
                  previousVersion: editingProduct.component.previousVersion,
                }
              : c
          )
        : [
            ...existingProduct.components,
            {
              type: editingProduct.component.type,
              currentVersion: editingProduct.component.currentVersion,
              previousVersion: editingProduct.component.previousVersion,
            },
          ];

      await updateMutation.mutateAsync({
        id: product.id,
        data: {
          components: updatedComponents.map((c: ComponentVersion) => ({
            type: c.type,
            currentVersion: c.currentVersion,
            previousVersion: c.previousVersion,
          })),
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

  const isEditing = editingProduct?.component !== undefined;

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
                  sm: "repeat(auto-fill, minmax(380px, 1fr))",
                  lg: "repeat(2, 1fr)",
                }
              : "1fr",
          gap: 2.5,
        }}
      >
        {filteredAndSortedProducts.length === 0 ? (
          <Box
            sx={{
              gridColumn: "1 / -1",
              py: 8,
              textAlign: "center",
              color: theme.palette.text.disabled,
            }}
          >
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              No products found. Create your first product to get started.
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