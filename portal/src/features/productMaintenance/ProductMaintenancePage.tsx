/**
 * Product Maintenance Page
 *
 * Main page for managing products and their components
 */

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  type Product,
  type ComponentVersion,
  type ComponentTypeValue,
} from "./types";
import { COMPONENT_TYPE_LABELS } from "./constants";

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
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleSave = () => {
    if (!editingProduct) return;

    if (editingProduct.component) {
      // Editing existing component
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
    } else {
      // Adding or updating product
      const exists = products.some((p) => p.id === editingProduct.product.id);
      if (exists) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.product.id ? editingProduct.product : p
          )
        );
      } else {
        setProducts((prev) => [...prev, editingProduct.product]);
      }
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Product Maintenance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage products and their component versions
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>

      {/* Products Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {product.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 2 }}
              >
                ID: {product.id}
              </Typography>

              {/* Components Table */}
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead
                    sx={{ backgroundColor: theme.palette.action.hover }}
                  >
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Component</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Current</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Previous</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.components.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            No components yet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      product.components.map((component) => (
                        <TableRow key={component.id}>
                          <TableCell>
                            <Typography variant="body2">
                              {
                                COMPONENT_TYPE_LABELS[
                                  component.type as ComponentTypeValue
                                ]
                              }
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.success.main,
                              }}
                            >
                              {component.currentVersion}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              {component.previousVersion}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                justifyContent: "flex-end",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleEditComponent(product, component)
                                }
                                title="Edit component"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleDeleteComponent(
                                    product.id,
                                    component.id
                                  )
                                }
                                title="Delete component"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Add Component Button */}
              <Button
                variant="text"
                size="small"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                onClick={() => {
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
                }}
              >
                Add Component
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProduct?.component ? "Edit Component" : "Add Component"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editingProduct?.component && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Editing component for: <strong>{selectedProduct?.name}</strong>
              </Alert>

              <TextField
                label="Component Type"
                select
                fullWidth
                value={editingProduct.component.type}
                onChange={(e) => {
                  if (editingProduct.component) {
                    setEditingProduct({
                      ...editingProduct,
                      component: {
                        ...editingProduct.component,
                        type: e.target.value as ComponentTypeValue,
                      },
                    });
                  }
                }}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="web">Web</option>
                <option value="services">Services</option>
                <option value="mobile">Mobile</option>
              </TextField>

              <TextField
                label="Current Version"
                fullWidth
                value={editingProduct.component.currentVersion}
                onChange={(e) => {
                  if (editingProduct.component) {
                    setEditingProduct({
                      ...editingProduct,
                      component: {
                        ...editingProduct.component,
                        currentVersion: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="e.g., 1.0.0"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Previous Version"
                fullWidth
                value={editingProduct.component.previousVersion}
                onChange={(e) => {
                  if (editingProduct.component) {
                    setEditingProduct({
                      ...editingProduct,
                      component: {
                        ...editingProduct.component,
                        previousVersion: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="e.g., 0.9.0"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
