import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export type PhaseEditDialogProps = {
  open: boolean;
  start: string;
  end: string;
  color: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function PhaseEditDialog({ open, start, end, color, onStartChange, onEndChange, onColorChange, onCancel, onSave }: PhaseEditDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Edit Phase</DialogTitle>
      <DialogContent className="space-y-3">
        <TextField label="Start" size="small" type="date" fullWidth value={start} onChange={(e) => onStartChange(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="End" size="small" type="date" fullWidth value={end} onChange={(e) => onEndChange(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="Color" size="small" type="color" fullWidth value={color} onChange={(e) => onColorChange(e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ style: { padding: 0, height: 40 } }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
