import { Box, Select, MenuItem, Typography, useTheme, alpha } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

export type ITOwnerFieldProps = {
  readonly itOwners: Array<{ id: string; name: string }>;
  readonly validItOwner: string;
  readonly localItOwner: string | undefined;
  readonly isLoadingITOwners: boolean;
  readonly onITOwnerChange: (value: string) => void;
};

export function ITOwnerField({
  itOwners,
  validItOwner,
  localItOwner,
  isLoadingITOwners,
  onITOwnerChange,
}: ITOwnerFieldProps) {
  const theme = useTheme();

  const handleMenuClose = () => {
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement?.blur) {
        activeElement.blur();
      }
    }, 0);
  };

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
        IT Owner
      </Typography>
      <Select
        id="plan-it-owner-select"
        name="planItOwner"
        value={validItOwner}
        onChange={(e: SelectChangeEvent) => onITOwnerChange(e.target.value)}
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
                None
              </em>
            );
          }
          const owner = itOwners.find((o) => o.id === selected);
          return (
            <span style={{ fontSize: "0.6875rem" }}>
              {owner ? owner.name : selected}
            </span>
          );
        }}
        size="small"
        sx={{
          width: "100%",
          fontSize: "0.6875rem",
          bgcolor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.5)
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
        <MenuItem value="" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
          <em>None</em>
        </MenuItem>
        {isLoadingITOwners ? (
          <MenuItem
            disabled
            sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
          >
            Loading...
          </MenuItem>
        ) : (
          itOwners.map((owner) => (
            <MenuItem
              key={owner.id}
              value={owner.id}
              sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
            >
              {owner.name}
            </MenuItem>
          ))
        )}
      </Select>
    </Box>
  );
}

