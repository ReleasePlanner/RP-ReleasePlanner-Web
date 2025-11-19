/**
 * Base Edit Dialog Component
 *
 * Reusable minimalist and elegant Material UI dialog container
 * Provides consistent styling and structure for all edit dialogs
 */

import { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  useTheme,
  alpha,
  Fade,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

export interface BaseEditDialogProps {
  open: boolean;
  onClose: () => void;
  editing: boolean;
  title: string;
  subtitle?: string;
  subtitleChip?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
  children: ReactNode;
  actions?: ReactNode;
  onSave?: () => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  isFormValid?: boolean;
  saveButtonDisabled?: boolean;
  showDefaultActions?: boolean;
}

export function BaseEditDialog({
  open,
  onClose,
  editing,
  title,
  subtitle,
  subtitleChip,
  maxWidth = "sm",
  fullWidth = true,
  children,
  actions,
  onSave,
  saveButtonText,
  cancelButtonText = "Cancelar",
  isFormValid = true,
  saveButtonDisabled,
  showDefaultActions = true,
}: BaseEditDialogProps) {
  const theme = useTheme();

  const defaultSaveText = editing
    ? `Actualizar ${title.split(" ").pop()}`
    : `Crear ${title.split(" ").pop()}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`
              : `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        },
      }}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 200 }}
    >
      <DialogTitle
        sx={{
          py: 1.5,
          px: 3,
          pb: 1.5,
          pt: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          position: "relative",
          zIndex: 0,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            {editing ? (
              <EditIcon sx={{ fontSize: 18 }} />
            ) : (
              <AddIcon sx={{ fontSize: 18 }} />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "0.8125rem",
                letterSpacing: "-0.01em",
                color: theme.palette.text.primary,
                mb: 0.25,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.625rem",
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  lineHeight: 1.3,
                }}
              >
                {subtitleChip && (
                  <Chip
                    label={subtitleChip}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: "0.5625rem",
                      fontWeight: 500,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                    }}
                  />
                )}
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 5.5, pb: 2, px: 3 }}>
        {children}
      </DialogContent>

      {showDefaultActions && (
        <DialogActions
          sx={{
            px: 3,
            py: 1.5,
            pt: 1.5,
            pb: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            gap: 1.5,
          }}
        >
          {actions || (
            <>
              <Button
                onClick={onClose}
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  px: 2,
                  py: 0.625,
                  borderRadius: 1.5,
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                  },
                }}
              >
                {cancelButtonText}
              </Button>
              {onSave && (
                <Button
                  onClick={onSave}
                  variant="contained"
                  size="small"
                  disabled={
                    saveButtonDisabled !== undefined
                      ? saveButtonDisabled
                      : !isFormValid
                  }
                  startIcon={
                    editing ? (
                      <EditIcon sx={{ fontSize: 14 }} />
                    ) : (
                      <AddIcon sx={{ fontSize: 14 }} />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.625,
                    borderRadius: 1.5,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.24)}`,
                    "&:hover": {
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.32)}`,
                    },
                    "&:disabled": {
                      boxShadow: "none",
                    },
                  }}
                >
                  {saveButtonText || defaultSaveText}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

