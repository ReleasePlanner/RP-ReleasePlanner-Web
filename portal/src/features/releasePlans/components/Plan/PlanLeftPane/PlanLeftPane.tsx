import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Stack,
  Typography,
  useTheme,
  alpha,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { PlanStatus } from "../../../types";
import { IT_OWNERS } from "../../../constants/itOwners";
import { PlanFeaturesTab } from "../PlanFeaturesTab/PlanFeaturesTab";
import { useAppSelector } from "@/store/hooks";
import { PlanComponentsTab } from "../PlanComponentsTab/PlanComponentsTab";
import type { PlanComponent } from "../../../types";
import { PlanCalendarsTab } from "../PlanCalendarsTab/PlanCalendarsTab";
import { PlanReferencesTab } from "../PlanReferencesTab/PlanReferencesTab";
import type { PlanReference } from "../../../types";

export type PlanLeftPaneProps = {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
  description?: string;
  status: PlanStatus;
  productId?: string;
  itOwner?: string;
  featureIds?: string[]; // Add this
  components?: PlanComponent[];
  calendarIds?: string[];
  references?: PlanReference[];
  onProductChange: (productId: string) => void;
  onDescriptionChange?: (description: string) => void;
  onStatusChange?: (status: PlanStatus) => void;
  onITOwnerChange?: (itOwnerId: string) => void;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onFeatureIdsChange?: (featureIds: string[]) => void; // Add this
  onComponentsChange?: (components: PlanComponent[]) => void;
  onCalendarIdsChange?: (calendarIds: string[]) => void;
  onReferencesChange?: (references: PlanReference[]) => void;
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
  description,
  status,
  productId,
  itOwner,
  featureIds = [], // Add this with default
  components = [], // Add this with default
  calendarIds = [],
  references = [],
  onProductChange,
  onDescriptionChange,
  onStatusChange,
  onITOwnerChange,
  onStartDateChange,
  onEndDateChange,
  onFeatureIdsChange, // Add this
  onComponentsChange, // Add this
  onCalendarIdsChange,
  onReferencesChange,
}: PlanLeftPaneProps) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Load products from Redux store (maintenance data)
  const products = useAppSelector((state) => state.products.products);

  // Calculate duration in days
  const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffTime = Math.abs(endTime - startTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration(startDate, endDate);

  // Format date range
  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const requiredFieldsFilled = Boolean(
    owner && startDate && endDate && id && productId
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        border: "1px solid",
        borderColor: "divider",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 2px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)",
        },
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
            "& .MuiTabs-flexContainer": {
              gap: 0,
            },
            "& .MuiTab-root": {
              minHeight: 48,
              minWidth: "auto",
              py: 1.25,
              px: 2.5,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
              letterSpacing: "0.015em",
              transition: theme.transitions.create(
                ["color", "background-color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                color: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.action.hover, 0.04),
              },
              "&.Mui-selected": {
                color: theme.palette.primary.main,
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
              "&.Mui-disabled": {
                opacity: 0.4,
              },
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: "2px 2px 0 0",
            },
          }}
        >
          <Tab label="Common Data" {...a11yProps(0)} />
          <Tab
            label="Features"
            {...a11yProps(1)}
            disabled={!requiredFieldsFilled}
          />
          <Tab
            label="Components"
            {...a11yProps(2)}
            disabled={!requiredFieldsFilled}
          />
          <Tab label="Calendars" {...a11yProps(3)} />
          <Tab label="References" {...a11yProps(4)} />
        </Tabs>
      </Box>

      {/* Tab Content - Scrollable */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          minHeight: 0,
          bgcolor: "grey.50",
        }}
      >
        {/* Tab 1: Common Data */}
        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              p: 2,
              maxWidth: "520px",
              mx: "auto",
            }}
          >
            <Stack spacing={1.75}>
              {/* Description */}
              <Tooltip
                title="Description of the release plan"
                arrow
                placement="top"
              >
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={description || ""}
                  onChange={(e) => {
                    if (onDescriptionChange) {
                      onDescriptionChange(e.target.value);
                    }
                  }}
                  placeholder="Description"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: alpha(theme.palette.divider, 0.2),
                        borderWidth: 1,
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 1.5,
                      },
                    },
                  }}
                />
              </Tooltip>

              {/* Status */}
              <Tooltip
                title="Current status of the release plan"
                arrow
                placement="top"
              >
                <Select
                  fullWidth
                  value={status}
                  displayEmpty
                  onChange={(e: SelectChangeEvent) => {
                    if (onStatusChange) {
                      onStatusChange(e.target.value as PlanStatus);
                    }
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <em style={{ color: theme.palette.text.secondary }}>
                          Status
                        </em>
                      );
                    }
                    const labels: Record<PlanStatus, string> = {
                      planned: "Planned",
                      in_progress: "In Progress",
                      done: "Completed",
                      paused: "Paused",
                    };
                    return labels[selected as PlanStatus];
                  }}
                  sx={{
                    fontSize: "0.875rem",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.divider, 0.2),
                      borderWidth: 1,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 1.5,
                    },
                  }}
                >
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="done">Completed</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                </Select>
              </Tooltip>

              {/* Period - Date Range */}
              <Box>
                <Stack direction="row" spacing={1}>
                  <Tooltip
                    title="Start date of the release plan"
                    arrow
                    placement="top"
                  >
                    <TextField
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        if (onStartDateChange) {
                          onStartDateChange(e.target.value);
                        }
                      }}
                      variant="outlined"
                      size="small"
                      aria-label="Start Date"
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                          "& fieldset": {
                            borderColor: alpha(theme.palette.divider, 0.2),
                            borderWidth: 1,
                          },
                          "&:hover fieldset": {
                            borderColor: alpha(theme.palette.primary.main, 0.4),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 1.5,
                          },
                        },
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    title="End date of the release plan"
                    arrow
                    placement="top"
                  >
                    <TextField
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        if (onEndDateChange) {
                          onEndDateChange(e.target.value);
                        }
                      }}
                      variant="outlined"
                      size="small"
                      aria-label="End Date"
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                          "& fieldset": {
                            borderColor: alpha(theme.palette.divider, 0.2),
                            borderWidth: 1,
                          },
                          "&:hover fieldset": {
                            borderColor: alpha(theme.palette.primary.main, 0.4),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 1.5,
                          },
                        },
                      }}
                    />
                  </Tooltip>
                </Stack>
                <Tooltip
                  title={`Duration: ${duration} ${
                    duration === 1 ? "day" : "days"
                  }`}
                  arrow
                  placement="top"
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      color: theme.palette.text.secondary,
                      mt: 0.75,
                      display: "block",
                      fontWeight: 400,
                      cursor: "help",
                    }}
                  >
                    {formatDateRange(startDate, endDate)} • {duration}{" "}
                    {duration === 1 ? "day" : "days"}
                  </Typography>
                </Tooltip>
              </Box>

              {/* Product */}
              <Tooltip
                title="Product associated with this release plan"
                arrow
                placement="top"
              >
                <Select
                  fullWidth
                  value={productId || ""}
                  displayEmpty
                  onChange={(e: SelectChangeEvent) => {
                    onProductChange(e.target.value);
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <em style={{ color: theme.palette.text.secondary }}>
                          Product
                        </em>
                      );
                    }
                    const product = products.find((p) => p.id === selected);
                    return product?.name || selected;
                  }}
                  sx={{
                    fontSize: "0.875rem",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.divider, 0.2),
                      borderWidth: 1,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 1.5,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </Tooltip>

              {/* IT Owner */}
              <Tooltip
                title="IT Owner responsible for this release plan"
                arrow
                placement="top"
              >
                <Select
                  fullWidth
                  value={itOwner || ""}
                  displayEmpty
                  onChange={(e: SelectChangeEvent) => {
                    if (onITOwnerChange) {
                      onITOwnerChange(e.target.value);
                    }
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <em style={{ color: theme.palette.text.secondary }}>
                          IT Owner
                        </em>
                      );
                    }
                    const owner = IT_OWNERS.find((o) => o.id === selected);
                    return owner?.name || selected;
                  }}
                  sx={{
                    fontSize: "0.875rem",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.divider, 0.2),
                      borderWidth: 1,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 1.5,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {IT_OWNERS.map((owner) => (
                    <MenuItem key={owner.id} value={owner.id}>
                      {owner.name}
                    </MenuItem>
                  ))}
                </Select>
              </Tooltip>
            </Stack>
          </Box>
        </TabPanel>

        {/* Tab 2: Features */}
        <TabPanel value={tabValue} index={1}>
          <PlanFeaturesTab
            productId={productId}
            featureIds={featureIds}
            onFeatureIdsChange={onFeatureIdsChange}
          />
        </TabPanel>

        {/* Tab 3: Components */}
        <TabPanel value={tabValue} index={2}>
          <PlanComponentsTab
            productId={productId}
            components={components}
            onComponentsChange={onComponentsChange}
          />
        </TabPanel>

        {/* Tab 4: Calendars */}
        <TabPanel value={tabValue} index={3}>
          <PlanCalendarsTab
            calendarIds={calendarIds}
            onCalendarIdsChange={onCalendarIdsChange}
          />
        </TabPanel>

        {/* Tab 5: References */}
        <TabPanel value={tabValue} index={4}>
          <PlanReferencesTab
            references={references}
            onReferencesChange={onReferencesChange}
          />
        </TabPanel>
      </Box>
    </Box>
  );
}
