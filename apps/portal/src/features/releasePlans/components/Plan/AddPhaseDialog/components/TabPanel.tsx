import { Box } from "@mui/material";

export type TabPanelProps = {
  readonly children?: React.ReactNode;
  readonly index: number;
  readonly value: number;
};

export function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`add-phase-tabpanel-${index}`}
      aria-labelledby={`add-phase-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

