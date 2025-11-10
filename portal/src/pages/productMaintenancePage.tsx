/**
 * Product Maintenance Page
 *
 * Main page for managing products and their components
 */

import { useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { type Product, type ComponentVersion } from "@/features/product/types";
import {
  ProductCard,
  ComponentEditDialog,
  ProductToolbar,
  type ViewMode,
  type SortBy,
} from "@/features/product/components";

/**
 * Mock data for products
 */
const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Release Planner",
    components: [
      {
        id: "comp-1",
        type: "web",
        currentVersion: "2.1.0",
        previousVersion: "2.0.5",
      },
      {
        id: "comp-2",
        type: "services",
        currentVersion: "1.5.0",
        previousVersion: "1.4.8",
      },
    ],
  },
  {
    id: "prod-2",
    name: "Analytics Platform",
    components: [
      {
        id: "comp-3",
        type: "web",
        currentVersion: "3.0.0",
        previousVersion: "2.9.5",
      },
      {
        id: "comp-4",
        type: "mobile",
        currentVersion: "1.2.0",
        previousVersion: "1.1.9",
      },
      {
        id: "comp-5",
        type: "services",
        currentVersion: "2.0.0",
        previousVersion: "1.9.2",
      },
    ],
  },
];

interface EditingProduct {
  product: Product;
  component?: ComponentVersion;
}

export function ProductMaintenancePage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      // For demo, sort by ID (would be by actual date in real app)
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const handleAddProduct = () => {
    setEditingProduct({
      product: { id: `prod-${Date.now()}`, name: "", components: [] },
    });
    setOpenDialog(true);
  };

  const handleEditComponent = (
    product: Product,
    component: ComponentVersion
  ) => {
    setSelectedProduct(product);
    setEditingProduct({ product, component });
    setOpenDialog(true);
  };

  const handleDeleteComponent = (productId: string, componentId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              components: p.components.filter((c) => c.id !== componentId),
            }
          : p
      )
    );
  };

  const handleAddComponent = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct({
      product,
      component: {
        id: `comp-${Date.now()}`,
        type: "web",
        currentVersion: "",
        previousVersion: "",
      },
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!editingProduct || !editingProduct.component) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct?.id
          ? {
              ...p,
              components: p.components.map((c) =>
                c.id === editingProduct.component?.id
                  ? editingProduct.component
                  : c
              ),
            }
          : p
      )
    );

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  const isEditing = editingProduct?.component !== undefined;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        py: 0,
        px: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Product Maintenance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage products and their component versions
        </Typography>
      </Box>

      {/* Toolbar with controls */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <ProductToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{ ml: "auto" }}
        >
          Add Product
        </Button>
      </Box>

      {/* Products Grid/List */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            viewMode === "grid" ? { xs: "1fr", md: "1fr 1fr" } : "1fr",
          gap: 3,
        }}
      >
        {filteredAndSortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEditComponent={handleEditComponent}
            onDeleteComponent={handleDeleteComponent}
            onAddComponent={handleAddComponent}
          />
        ))}
      </Box>
      {/* Edit Dialog */}
      <ComponentEditDialog
        open={openDialog}
        editing={isEditing}
        component={editingProduct?.component || null}
        selectedProductName={selectedProduct?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onComponentChange={(component) => {
          if (editingProduct) {
            setEditingProduct({
              ...editingProduct,
              component,
            });
          }
        }}
      />
    </Box>
  );
}
