import { CardHeader, Chip, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type PlanHeaderProps = {
  name: string;
  status: 'planned' | 'in_progress' | 'done';
  description?: string;
  expanded: boolean;
  onToggleExpanded: () => void;
};

export default function PlanHeader({ name, status, description, expanded, onToggleExpanded }: PlanHeaderProps) {
  return (
    <CardHeader
      title={
        <div className="flex items-center gap-3">
          <Typography variant="h6">{name}</Typography>
          <Chip
            size="small"
            label={status}
            color={status === 'done' ? 'success' : status === 'in_progress' ? 'primary' : 'default'}
          />
        </div>
      }
      subheader={description}
      action={
        <IconButton
          aria-label="Expand"
          aria-expanded={expanded}
          onClick={onToggleExpanded}
          size="small"
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      }
      sx={{
        position: 'sticky',
        top: { xs: 56, md: 64 },
        zIndex: 1,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    />
  );
}
