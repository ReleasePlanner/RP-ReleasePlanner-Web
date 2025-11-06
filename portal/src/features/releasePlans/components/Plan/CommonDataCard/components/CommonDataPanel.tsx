import { Box, Divider } from "@mui/material";
import {
  PersonOutline,
  CalendarToday,
  FolderOpen,
  Schedule,
} from "@mui/icons-material";
import { DataRow } from "./DataRow";

interface CommonDataPanelProps {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
}

function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "—";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays} days`;
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "—";

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function CommonDataPanel({
  owner,
  startDate,
  endDate,
  id,
}: CommonDataPanelProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <DataRow icon={<PersonOutline />} label="Owner" value={owner || "—"} />

      <Divider sx={{ my: 1, opacity: 0.6 }} />

      <DataRow
        icon={<CalendarToday />}
        label="Duration"
        value={formatDateRange(startDate, endDate)}
      />

      <DataRow
        icon={<Schedule />}
        label="Start Date"
        value={formatDateDisplay(startDate)}
      />

      <DataRow
        icon={<Schedule />}
        label="End Date"
        value={formatDateDisplay(endDate)}
      />

      <Divider sx={{ my: 1, opacity: 0.6 }} />

      <DataRow icon={<FolderOpen />} label="Plan ID" value={id || "—"} />
    </Box>
  );
}
