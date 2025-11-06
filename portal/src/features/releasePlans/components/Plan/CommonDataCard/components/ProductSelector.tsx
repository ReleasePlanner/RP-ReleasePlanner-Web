import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useTheme,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { Product } from "../types";

interface ProductSelectorProps {
  selectedProduct?: string;
  products: Product[];
  onProductChange: (productId: string) => void;
}

export function ProductSelector({
  selectedProduct,
  products,
  onProductChange,
}: ProductSelectorProps) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<string>) => {
    onProductChange(event.target.value);
  };

  return (
    <FormControl
      fullWidth
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          fontSize: "0.875rem",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: theme.palette.primary.main,
          },
        },
        "& .MuiInputLabel-root": {
          fontSize: "0.875rem",
          fontWeight: 500,
          "&.Mui-focused": {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <InputLabel>Select Product</InputLabel>
      <Select
        value={selectedProduct || ""}
        label="Select Product"
        onChange={handleChange}
      >
        {products.map((product) => (
          <MenuItem
            key={product.id}
            value={product.id}
            sx={{
              fontSize: "0.875rem",
              py: 1,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            {product.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
