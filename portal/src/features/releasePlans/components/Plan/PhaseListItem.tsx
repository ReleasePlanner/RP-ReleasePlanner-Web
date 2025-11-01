import { IconButton, ListItem, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export type PhaseListItemProps = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  onEdit: (id: string) => void;
};

export default function PhaseListItem({ id, name, startDate, endDate, onEdit }: PhaseListItemProps) {
  const secondary = startDate && endDate ? `${startDate} → ${endDate}` : undefined;
  return (
    <ListItem disableGutters divider className="flex items-center justify-between">
      <ListItemText primary={name} secondary={secondary} />
      <IconButton size="small" aria-label="Edit phase" onClick={() => onEdit(id)}>
        <EditIcon fontSize="small" />
      </IconButton>
    </ListItem>
  );
}


