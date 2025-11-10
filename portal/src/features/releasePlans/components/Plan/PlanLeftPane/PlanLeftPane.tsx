import { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import {
  Info as InfoIcon,
  Extension as ExtensionIcon,
  Inventory as InventoryIcon,
  CalendarMonth as CalendarIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { CommonDataCard } from "../CommonDataCard";
import PhasesList from "../PhasesList/PhasesList";
import type { PlanPhase } from "../../../types";
import type { Product } from "../CommonDataCard/types";

export type PlanLeftPaneProps = {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
  phases: PlanPhase[];
  onAddPhase: () => void;
  onEditPhase: (id: string) => void;
  selectedProduct: string;
  products: Product[];
  onProductChange: (productId: string) => void;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plan-tabpanel-${index}`}
      aria-labelledby={`plan-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `plan-tab-${index}`,
    "aria-controls": `plan-tabpanel-${index}`,
  };
}

export default function PlanLeftPane({
  owner,
  startDate,
  endDate,
  id,
  phases,
  onAddPhase,
  onEditPhase,
  selectedProduct,
  products,
  onProductChange,
}: PlanLeftPaneProps) {
  const [tabValue, setTabValue] = useState(0);

  console.log("PlanLeftPane rendering with tabs, current tab:", tabValue);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    console.log("Tab changed to:", newValue);
  };

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: "divider" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Plan information tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<InfoIcon fontSize="small" />}
            iconPosition="start"
            label="Common Data"
            {...a11yProps(0)}
            sx={{ minHeight: 48, textTransform: "none", fontWeight: 500 }}
          />
          <Tab
            icon={<ExtensionIcon fontSize="small" />}
            iconPosition="start"
            label="Features"
            {...a11yProps(1)}
            sx={{ minHeight: 48, textTransform: "none", fontWeight: 500 }}
          />
          <Tab
            icon={<InventoryIcon fontSize="small" />}
            iconPosition="start"
            label="Components"
            {...a11yProps(2)}
            sx={{ minHeight: 48, textTransform: "none", fontWeight: 500 }}
          />
          <Tab
            icon={<CalendarIcon fontSize="small" />}
            iconPosition="start"
            label="Calendars"
            {...a11yProps(3)}
            sx={{ minHeight: 48, textTransform: "none", fontWeight: 500 }}
          />
          <Tab
            icon={<LinkIcon fontSize="small" />}
            iconPosition="start"
            label="References"
            {...a11yProps(4)}
            sx={{ minHeight: 48, textTransform: "none", fontWeight: 500 }}
          />
        </Tabs>
      </Box>

      {/* Tab 1: Common Data */}
      <TabPanel value={tabValue} index={0}>
        <div className="grid grid-cols-1 gap-4">
          <CommonDataCard
            owner={owner}
            startDate={startDate}
            endDate={endDate}
            id={id}
            selectedProduct={selectedProduct}
            products={products}
            onProductChange={onProductChange}
          />
          <PhasesList phases={phases} onAdd={onAddPhase} onEdit={onEditPhase} />
        </div>
      </TabPanel>

      {/* Tab 2: Features */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
          Features content will be displayed here
        </Box>
      </TabPanel>

      {/* Tab 3: Components */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
          Components content will be displayed here
        </Box>
      </TabPanel>

      {/* Tab 4: Calendars */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
          Calendars content will be displayed here
        </Box>
      </TabPanel>

      {/* Tab 5: References */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
          References content will be displayed here
        </Box>
      </TabPanel>
    </Paper>
  );
}
