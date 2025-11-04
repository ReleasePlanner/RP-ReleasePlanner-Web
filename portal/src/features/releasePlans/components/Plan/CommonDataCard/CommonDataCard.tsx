import { Card, CardContent, Typography } from "@mui/material";
import { TabPanel } from "./TabPanel";
import { DataItem } from "./DataItem";
import { DataTabs } from "./DataTabs";
import { useTabState } from "./useTabState";
import { createCommonDataItems, type CommonDataCardProps } from "./types";

export type { CommonDataCardProps };

export default function CommonDataCard(props: CommonDataCardProps) {
  const { activeTab, handleTabChange } = useTabState(0);
  const data = createCommonDataItems(props);

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" component="div" sx={{ p: 2, pb: 0 }}>
          Common Data
        </Typography>
        <DataTabs
          data={data}
          value={activeTab}
          onChange={handleTabChange}
          id="common-data"
        />
        {data.map((item, index) => (
          <TabPanel
            key={item.label}
            value={activeTab}
            index={index}
            id="common-data"
          >
            <DataItem label={item.label} value={item.value} />
          </TabPanel>
        ))}
      </CardContent>
    </Card>
  );
}
