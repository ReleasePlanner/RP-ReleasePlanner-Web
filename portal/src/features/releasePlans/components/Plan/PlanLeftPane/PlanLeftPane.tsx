import { useState } from "react";
import { Box, Tabs, Tab, Stack } from "@mui/material";
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
      {value === index && (
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      )}
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
      }}
    >
      {/* Tabs Header - Fixed */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          flexShrink: 0,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Plan information tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              py: 1,
              px: 2,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
            "& .MuiTabs-indicator": {
              height: 3,
            },
          }}
        >
          <Tab
            icon={<InfoIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Data"
            {...a11yProps(0)}
          />
          <Tab
            icon={<ExtensionIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Features"
            {...a11yProps(1)}
          />
          <Tab
            icon={<InventoryIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Components"
            {...a11yProps(2)}
          />
          <Tab
            icon={<CalendarIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Calendars"
            {...a11yProps(3)}
          />
          <Tab
            icon={<LinkIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="References"
            {...a11yProps(4)}
          />
        </Tabs>
      </Box>

      {/* Tab Content - Scrollable */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {/* Tab 1: Common Data */}
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={2} sx={{ p: 2 }}>
            <CommonDataCard
              owner={owner}
              startDate={startDate}
              endDate={endDate}
              id={id}
              selectedProduct={selectedProduct}
              products={products}
              onProductChange={onProductChange}
            />
            <PhasesList
              phases={phases}
              onAdd={onAddPhase}
              onEdit={onEditPhase}
            />
          </Stack>
        </TabPanel>

        {/* Tab 2: Features */}
        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Features content will be displayed here
          </Box>
        </TabPanel>

        {/* Tab 3: Components */}
        <TabPanel value={tabValue} index={2}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Components content will be displayed here
          </Box>
        </TabPanel>

        {/* Tab 4: Calendars */}
        <TabPanel value={tabValue} index={3}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Calendars content will be displayed here
          </Box>
        </TabPanel>

        {/* Tab 5: References */}
        <TabPanel value={tabValue} index={4}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            References content will be displayed here
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
}
