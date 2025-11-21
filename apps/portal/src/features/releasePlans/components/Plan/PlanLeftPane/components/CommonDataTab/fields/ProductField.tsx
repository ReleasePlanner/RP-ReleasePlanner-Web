import { Box, TextField, Select, MenuItem, Typography, useTheme, alpha } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

export type ProductFieldProps = {
  readonly originalProductId?: string;
  readonly products: Array<{ id: string; name: string }>;
  readonly validProductId: string;
  readonly localProductId: string | undefined;
  readonly onProductChange: (value: string) => void;
};

export function ProductField({
  originalProductId,
  products,
  validProductId,
  localProductId,
  onProductChange,
}: ProductFieldProps) {
  const theme = useTheme();

  const handleMenuClose = () => {
    if (typeof globalThis !== "undefined" && "requestAnimationFrame" in globalThis) {
      globalThis.requestAnimationFrame(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.blur) {
          activeElement.blur();
        }
      });
    } else {
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.blur) {
          activeElement.blur();
        }
      }, 0);
    }
  };

  if (originalProductId) {
    // Product is locked (already saved in BD) - show as read-only
    const product = products.find((p) => p.id === originalProductId);
    return (
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.625rem",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            mb: 0.5,
            display: "block",
          }}
        >
          Product
        </Typography>
        <TextField
          id="plan-product-display"
          name="planProductId"
          value={product ? product.name : originalProductId}
          fullWidth
          size="small"
          disabled
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.3)
                  : alpha(theme.palette.action.disabledBackground, 0.15),
              borderRadius: 1,
            },
            "& .MuiInputBase-input": {
              fontSize: "0.6875rem",
              fontWeight: 500,
              color: theme.palette.text.primary,
              cursor: "default",
              py: 0.625,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.divider, 0.15),
              borderWidth: 1,
            },
          }}
        />
      </Box>
    );
  }

  // Product can be selected (not yet saved)
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.625rem",
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mb: 0.5,
          display: "block",
        }}
      >
        Product <span style={{ color: theme.palette.error.main }}>*</span>
      </Typography>
      <Select
        id="plan-product-select"
        name="planProductId"
        value={validProductId}
        onChange={(e: SelectChangeEvent) => onProductChange(e.target.value)}
        displayEmpty
        slotProps={{
          menu: {
            disableAutoFocusItem: true,
            onClose: handleMenuClose,
          },
        }}
        renderValue={(selected) => {
          if (!selected || selected === "") {
            return (
              <em
                style={{
                  color: theme.palette.text.secondary,
                  fontStyle: "normal",
                  fontSize: "0.6875rem",
                }}
              >
                Select a product
              </em>
            );
          }
          const product = products.find((p) => p.id === selected);
          return (
            <span style={{ fontSize: "0.6875rem" }}>
              {product ? product.name : selected}
            </span>
          );
        }}
        size="small"
        sx={{
          fontSize: "0.6875rem",
          bgcolor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.3)
              : "background.paper",
          "& .MuiSelect-select": {
            py: 0.625,
            fontSize: "0.6875rem",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.divider, 0.2),
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.primary.main, 0.4),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 1.5,
          },
        }}
      >
        <MenuItem
          value=""
          sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
        >
          <em>None</em>
        </MenuItem>
        {products.map((product) => (
          <MenuItem
            key={product.id}
            value={product.id}
            sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
          >
            {product.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

