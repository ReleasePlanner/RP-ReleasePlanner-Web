import { Box, IconButton, ListItem, ListItemText } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

export type PhaseListItemProps = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
};

export default function PhaseListItem({ id, name, startDate, endDate, onEdit, onDelete, onView }: PhaseListItemProps) {
  const secondary = startDate && endDate ? `${startDate} → ${endDate}` : undefined;
  return (
    <ListItem
      disableGutters
      disablePadding
      dense
      className="flex items-center justify-between h-full min-w-0"
      sx={{ minHeight: 'unset', height: '100%' }}
    >
      <ListItemText
        primary={name}
        secondary={secondary}
        primaryTypographyProps={{ variant: 'body2', sx: { lineHeight: 1, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
        secondaryTypographyProps={{ variant: 'caption', sx: { fontSize: 10, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
        sx={{ my: 0, py: 0, pr: 0.5, minWidth: 0, flex: '1 1 0%' }}
      />
      <Box className="flex items-center gap-1 flex-shrink-0" sx={{ ml: 1, pr: 1 }}>
        <IconButton
          size="small"
          aria-label="View phase"
          onClick={() => onView?.(id)}
          edge="end"
          sx={{ p: 0.25 }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Edit phase"
          onClick={() => onEdit(id)}
          edge="end"
          sx={{ p: 0.25 }}
        >
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Delete phase"
          onClick={() => onDelete?.(id)}
          edge="end"
          sx={{ p: 0.25 }}
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
    </ListItem>
  );
}


