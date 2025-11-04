import { Tabs, Tab, Box } from "@mui/material";
import { TabLabel } from "./TabLabel";
import { createA11yProps } from "./TabPanel";
import type { CommonDataItem } from "./types";

export interface DataTabsProps {
  data: CommonDataItem[];
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  id?: string;
}

export function DataTabs({
  data,
  value,
  onChange,
  id = "common-data",
}: DataTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={value}
        onChange={onChange}
        aria-label={`${id} tabs`}
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            minHeight: 48,
            fontSize: "0.75rem",
            minWidth: "auto",
            flex: 1,
          },
        }}
      >
        {data.map((item, index) => (
          <Tab
            key={item.label}
            label={<TabLabel icon={item.icon} label={item.label} />}
            {...createA11yProps(index, id)}
          />
        ))}
      </Tabs>
    </Box>
  );
}
