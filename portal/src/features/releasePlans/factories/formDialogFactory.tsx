import type { ReactNode } from "react";
import { DialogFactory } from "../components/DialogFactory/DialogFactory";

export interface FormData {
  [key: string]: unknown;
}

/**
 * Factory function for creating form dialogs
 * Reduces boilerplate in form-based dialogs
 */
export function createFormDialog(config: {
  title: string;
  confirmText?: string;
  validate?: (formData: FormData) => boolean;
}) {
  return function FormDialog({
    open,
    onClose,
    onSubmit,
    children,
  }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    children: ReactNode;
  }) {
    const handleSubmit = () => {
      // In a real implementation, this would extract form data
      // and validate it using the validate function
      const formData: FormData = {};
      onSubmit(formData);
    };

    return (
      <DialogFactory
        title={config.title}
        open={open}
        onClose={onClose}
        onConfirm={handleSubmit}
        confirmText={config.confirmText || "Save"}
        disableConfirm={config.validate ? !config.validate({}) : false}
      >
        {children}
      </DialogFactory>
    );
  };
}
