import { Button, List, Typography } from '@mui/material';
import type { PlanPhase } from '../../types';
import PhaseListItem from './PhaseListItem';

export type PhasesListProps = {
  phases: PlanPhase[];
  onAdd: () => void;
  onEdit: (id: string) => void;
};

export default function PhasesList({ phases, onAdd, onEdit }: PhasesListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Typography variant="overline" color="text.secondary">Phases</Typography>
        <Button size="small" variant="outlined" onClick={onAdd}>Add</Button>
      </div>
      <List dense disablePadding>
        {phases.map((p) => (
          <PhaseListItem key={p.id} id={p.id} name={p.name} startDate={p.startDate} endDate={p.endDate} onEdit={onEdit} />
        ))}
      </List>
    </div>
  );
}


