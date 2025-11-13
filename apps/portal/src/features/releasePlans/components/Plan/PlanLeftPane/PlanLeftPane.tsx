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
  FormControl,
  InputLabel,
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
import { TIMELINE_DIMENSIONS } from "../../Gantt/GanttTimeline/constants";
import { formatDateLocal } from "../../../lib/date";

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
  onScrollToDate?: (date: string) => void;
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
      style={{
        height: "100%",
        width: "100%",
        display: value === index ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      {value === index && (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
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
  onScrollToDate,
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

  // Format date range using browser locale (dates are in UTC)
  const formatDateRange = (start: string, end: string): string => {
    return `${formatDateLocal(start, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${formatDateLocal(end, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
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
      {/* Tabs Header - Fixed - Aligned to Timeline Height */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          flexShrink: 0,
          height: 48,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
            height: 48,
            "& .MuiTabs-flexContainer": {
              gap: 0,
              height: "100%",
              alignItems: "center",
            },
            "& .MuiTab-root": {
              minHeight: 48,
              height: 48,
              minWidth: "auto",
              maxWidth: "none",
              py: 0,
              px: 1,
              pt: 0,
              pb: 0,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.75rem",
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : theme.palette.text.secondary,
              letterSpacing: "0.01em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: theme.transitions.create(
                ["color", "background-color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.95)"
                    : theme.palette.text.primary,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.action.hover, 0.08)
                    : alpha(theme.palette.action.hover, 0.04),
              },
              "&.Mui-selected": {
                color: theme.palette.primary.main,
                fontWeight: 600,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.primary.main, 0.04),
              },
              "&.Mui-disabled": {
                opacity: theme.palette.mode === "dark" ? 0.3 : 0.4,
              },
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: "2px 2px 0 0",
            },
          }}
        >
          <Tab label="Datos Comunes" {...a11yProps(0)} />
          <Tab
            label="Features"
            {...a11yProps(1)}
            disabled={!requiredFieldsFilled}
          />
          <Tab
            label="Componentes"
            {...a11yProps(2)}
            disabled={!requiredFieldsFilled}
          />
          <Tab label="Calendarios" {...a11yProps(3)} />
          <Tab label="Referencias" {...a11yProps(4)} />
        </Tabs>
      </Box>

      {/* Tab Content - Scrollable */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          minHeight: 0,
          bgcolor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "grey.50",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tab 1: Common Data */}
        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              p: { xs: 1.5, sm: 1.75 },
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack spacing={1.75} sx={{ width: "100%" }}>
              {/* Description */}
              <TextField
                fullWidth
                multiline
                rows={3}
                value={description || ""}
                onChange={(e) => {
                  if (onDescriptionChange) {
                    onDescriptionChange(e.target.value);
                  }
                }}
                placeholder="Descripción del plan de release..."
                variant="outlined"
                size="small"
                label="Descripción"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.875rem",
                    bgcolor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.5)
                      : "background.paper",
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

              {/* Status */}
              <FormControl fullWidth size="small">
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  label="Estado"
                  onChange={(e: SelectChangeEvent) => {
                    if (onStatusChange) {
                      onStatusChange(e.target.value as PlanStatus);
                    }
                  }}
                  sx={{
                    fontSize: "0.875rem",
                    bgcolor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.5)
                      : "background.paper",
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
                  <MenuItem value="planned">Planificado</MenuItem>
                  <MenuItem value="in_progress">En Progreso</MenuItem>
                  <MenuItem value="done">Completado</MenuItem>
                  <MenuItem value="paused">Pausado</MenuItem>
                </Select>
              </FormControl>

              {/* Period - Date Range */}
              <Box>
                <Stack 
                  direction={{ xs: "column", sm: "row" }} 
                  spacing={1.5}
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
                    label="Fecha Inicio"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.875rem",
                        bgcolor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.5)
                          : "background.paper",
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
                    label="Fecha Fin"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.875rem",
                        bgcolor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.5)
                          : "background.paper",
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
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    color: theme.palette.text.secondary,
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 400,
                  }}
                >
                  <span>{formatDateRange(startDate, endDate)}</span>
                  <span>•</span>
                  <span>{duration} {duration === 1 ? "día" : "días"}</span>
                </Typography>
              </Box>

              {/* Product */}
              <FormControl fullWidth size="small">
                <InputLabel id="product-label">Producto</InputLabel>
                <Select
                  labelId="product-label"
                  value={productId || ""}
                  label="Producto"
                  onChange={(e: SelectChangeEvent) => {
                    onProductChange(e.target.value);
                  }}
                  sx={{
                    fontSize: "0.875rem",
                    bgcolor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.5)
                      : "background.paper",
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
                    <em>Ninguno</em>
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* IT Owner */}
              <FormControl fullWidth size="small">
                <InputLabel id="it-owner-label">IT Owner</InputLabel>
                <Select
                  labelId="it-owner-label"
                  value={itOwner || ""}
                  label="IT Owner"
                  onChange={(e: SelectChangeEvent) => {
                    if (onITOwnerChange) {
                      onITOwnerChange(e.target.value);
                    }
                  }}
                  sx={{
                    fontSize: "0.875rem",
                    bgcolor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.5)
                      : "background.paper",
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
                    <em>Ninguno</em>
                  </MenuItem>
                  {IT_OWNERS.map((owner) => (
                    <MenuItem key={owner.id} value={owner.id}>
                      {owner.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            onScrollToDate={onScrollToDate}
          />
        </TabPanel>
      </Box>
    </Box>
  );
}
