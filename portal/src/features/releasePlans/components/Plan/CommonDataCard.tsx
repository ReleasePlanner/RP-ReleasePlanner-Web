import { Typography } from '@mui/material';

export type CommonDataCardProps = {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
};

function formatRange(a: string, b: string): string {
  return `${a} → ${b}`;
}

export default function CommonDataCard({ owner, startDate, endDate, id }: CommonDataCardProps) {
  return (
    <div className="space-y-3">
      <div>
        <Typography variant="overline" color="text.secondary">Common data</Typography>
      </div>
      <div>
        <Typography variant="body2" color="text.secondary">Owner</Typography>
        <Typography variant="body1">{owner}</Typography>
      </div>
      <div>
        <Typography variant="body2" color="text.secondary">Schedule</Typography>
        <Typography variant="body1">{formatRange(startDate, endDate)}</Typography>
      </div>
      <div>
        <Typography variant="body2" color="text.secondary">ID</Typography>
        <Typography variant="body1">{id}</Typography>
      </div>
    </div>
  );
}


