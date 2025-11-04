import { DialogFactory } from "../components/DialogFactory/DialogFactory";

/**
 * Factory for confirmation dialogs
 * Implements consistent confirmation patterns
 */
export function createConfirmationDialog(config: {
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: "primary" | "secondary" | "error";
}) {
  return function ConfirmationDialog({
    open,
    onClose,
    onConfirm,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) {
    return (
      <DialogFactory
        title={config.title}
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmText={config.confirmText || "Confirm"}
        maxWidth="xs"
      >
        <div className="py-4">
          <p className="text-gray-700">{config.message}</p>
        </div>
      </DialogFactory>
    );
  };
}
