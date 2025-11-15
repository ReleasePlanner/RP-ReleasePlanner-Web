/**
 * Country Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing countries
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  alpha,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import type { Country } from "@/api/services/countries.service";

interface CountryEditDialogProps {
  open: boolean;
  country: Country | null;
  onClose: () => void;
  onSave: () => void;
  onCountryChange: (country: Country) => void;
}

export function CountryEditDialog({
  open,
  country,
  onClose,
  onSave,
  onCountryChange,
}: CountryEditDialogProps) {
  const theme = useTheme();
  const isEditing = country?.id && !country.id.startsWith('country-');

  if (!country) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          fontWeight: 600,
          fontSize: "1.25rem",
          color: theme.palette.text.primary,
        }}
      >
        {isEditing ? "Edit Country" : "Create Country"}
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 4, pb: 2 }}>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Basic Information
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Country Name"
                value={country.name || ""}
                onChange={(e) =>
                  onCountryChange({ ...country, name: e.target.value })
                }
                required
                autoFocus
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Country Code"
                value={country.code || ""}
                onChange={(e) =>
                  onCountryChange({ ...country, code: e.target.value.toUpperCase() })
                }
                required
                placeholder="e.g., US, CA, MX"
                size="medium"
                inputProps={{ maxLength: 10 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                fullWidth
                label="ISO Code (Optional)"
                value={country.isoCode || ""}
                onChange={(e) =>
                  onCountryChange({ ...country, isoCode: e.target.value })
                }
                placeholder="e.g., USA, CAN, MEX"
                size="medium"
                inputProps={{ maxLength: 10 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Region (Optional)"
                value={country.region || ""}
                onChange={(e) =>
                  onCountryChange({ ...country, region: e.target.value })
                }
                placeholder="e.g., North America, Europe"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 500,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: alpha(theme.palette.text.secondary, 0.08),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!country.name || !country.code || country.name.trim() === "" || country.code.trim() === ""}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 600,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          {isEditing ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

