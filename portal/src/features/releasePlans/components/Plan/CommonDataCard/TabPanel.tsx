import { Box } from "@mui/material";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  id?: string;
}

export function TabPanel({
  children,
  value,
  index,
  id = "tab",
  ...other
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${id}-tabpanel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export function createA11yProps(index: number, id = "tab") {
  return {
    id: `${id}-tab-${index}`,
    "aria-controls": `${id}-tabpanel-${index}`,
  };
}
