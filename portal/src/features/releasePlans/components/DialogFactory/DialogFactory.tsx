import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import type { ReactNode } from "react";

/**
 * Factory for creating consistent dialog components
 * Implements Factory Pattern to reduce boilerplate and ensure consistency
 */
export type DialogConfig = {
  title: string;
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  disableConfirm?: boolean;
};

export type DialogFactoryProps = DialogConfig & {
  children: ReactNode;
};

/**
 * Base dialog factory component
 * Follows DRY principle - creates consistent dialogs throughout the app
 */
export function DialogFactory({
  title,
  open,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  maxWidth = "sm",
  fullWidth = true,
  disableConfirm = false,
  children,
}: DialogFactoryProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {cancelText}
        </Button>
        {onConfirm && (
          <Button
            onClick={onConfirm}
            variant="contained"
            disabled={disableConfirm}
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
