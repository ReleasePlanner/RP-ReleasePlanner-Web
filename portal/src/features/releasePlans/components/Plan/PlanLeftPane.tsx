import CommonDataCard from './CommonDataCard';
import PhasesList from './PhasesList';
import type { PlanPhase } from '../../types';

export type PlanLeftPaneProps = {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
  phases: PlanPhase[];
  onAddPhase: () => void;
  onEditPhase: (id: string) => void;
};

export default function PlanLeftPane({ owner, startDate, endDate, id, phases, onAddPhase, onEditPhase }: PlanLeftPaneProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <CommonDataCard owner={owner} startDate={startDate} endDate={endDate} id={id} />
      <PhasesList phases={phases} onAdd={onAddPhase} onEdit={onEditPhase} />
    </div>
  );
}


