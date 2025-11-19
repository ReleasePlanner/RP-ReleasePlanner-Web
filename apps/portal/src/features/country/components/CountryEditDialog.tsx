/**
 * Country Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing countries
 */

import {
  TextField,
  Stack,
  Box,
  useTheme,
  alpha,
  Grid,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
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

  const isValid = !!country.name?.trim() && !!country.code?.trim();

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Country" : "New Country"}
      subtitle="Manage country information"
      maxWidth="sm"
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create Country"}
      isFormValid={isValid}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* Spacer to ensure controls are below header divider */}
        <Box sx={{ pt: 1 }} />
        
        {/* Country Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Country Name"
          placeholder="e.g., United States, Canada, Mexico"
          value={country.name || ""}
          onChange={(e) =>
            onCountryChange({ ...country, name: e.target.value })
          }
          required
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            },
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />

        {/* Code and ISO Code in two columns */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Country Code"
              placeholder="e.g., US, CA, MX"
              value={country.code || ""}
              onChange={(e) =>
                onCountryChange({ ...country, code: e.target.value.toUpperCase() })
              }
              required
              inputProps={{ maxLength: 10 }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  "&.MuiInputLabel-shrink": {
                    backgroundColor: theme.palette.background.paper,
                    paddingLeft: "6px",
                    paddingRight: "6px",
                    zIndex: 1,
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.6875rem",
                  "& input": {
                    py: 0.625,
                    fontSize: "0.6875rem",
                  },
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginTop: "4px",
                  marginLeft: "0px",
                  fontSize: "0.625rem",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="ISO Code"
              placeholder="e.g., USA, CAN, MEX"
              value={country.isoCode || ""}
              onChange={(e) =>
                onCountryChange({ ...country, isoCode: e.target.value })
              }
              inputProps={{ maxLength: 10 }}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  "&.MuiInputLabel-shrink": {
                    backgroundColor: theme.palette.background.paper,
                    paddingLeft: "6px",
                    paddingRight: "6px",
                    zIndex: 1,
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.6875rem",
                  "& input": {
                    py: 0.625,
                    fontSize: "0.6875rem",
                  },
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
                "& .MuiFormHelperText-root": {
                  marginTop: "4px",
                  marginLeft: "0px",
                  fontSize: "0.625rem",
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Region */}
        <TextField
          fullWidth
          size="small"
          label="Region"
          placeholder="e.g., North America, Europe, Asia"
          value={country.region || ""}
          onChange={(e) =>
            onCountryChange({ ...country, region: e.target.value })
          }
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            },
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />
      </Stack>
    </BaseEditDialog>
  );
}

