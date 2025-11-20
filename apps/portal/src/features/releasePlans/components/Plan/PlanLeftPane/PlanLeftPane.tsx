import { useState, useEffect, useMemo, memo, useRef } from "react";
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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { getTimelineColors } from "../../Gantt/GanttTimeline/constants";
import type { SelectChangeEvent } from "@mui/material";
import type { PlanStatus } from "../../../types";
import { PlanFeaturesTab } from "../PlanFeaturesTab/PlanFeaturesTab";
import { useITOwners, useProducts } from "@/api/hooks";
import { PlanComponentsTab } from "../PlanComponentsTab/PlanComponentsTab";
import type { PlanComponent } from "../../../types";
import { PlanCalendarsTab } from "../PlanCalendarsTab/PlanCalendarsTab";
import { PlanReferencesTab } from "../PlanReferencesTab/PlanReferencesTab";
import type { PlanReference } from "../../../types";
import { TIMELINE_DIMENSIONS } from "../../Gantt/GanttTimeline/constants";
import { formatDateLocal } from "../../../lib/date";
import { useQueryClient } from "@tanstack/react-query";
import { featuresService } from "@/api/services/features.service";

export type PlanLeftPaneProps = {
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
  description?: string;
  status: PlanStatus;
  productId?: string;
  originalProductId?: string; // Product ID from saved plan (BD) - if exists, product is locked
  itOwner?: string;
  featureIds?: string[]; // Add this
  components?: PlanComponent[];
  calendarIds?: string[];
  references?: PlanReference[];
  onNameChange?: (name: string) => void;
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
  onSaveTab?: (tabIndex: number) => Promise<void>;
  isSaving?: boolean;
  hasTabChanges?: Record<number, boolean>;
  planUpdatedAt?: string | Date; // Plan updatedAt for optimistic locking
  plan?: any; // Full plan object for optimistic locking (using any to avoid circular dependency)
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  hasPendingChanges?: boolean;
}

const TabPanel = memo(function TabPanel(props: TabPanelProps) {
  const { children, value, index, onSave, isSaving, hasPendingChanges = false, ...other } = props;
  const theme = useTheme();
  const colors = getTimelineColors(theme);

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
            position: "relative",
          }}
        >
          {/* Minimalist save button at top - always visible, enabled only when there are pending changes */}
          {onSave && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 12,
                display: "flex",
                justifyContent: "flex-end",
                px: 1.5,
                py: 0.75,
                backgroundColor: theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.95)
                  : alpha(theme.palette.background.paper, 0.98),
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                boxShadow: theme.palette.mode === "dark"
                  ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`
                  : `0 1px 4px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            >
              <Tooltip
                title={
                  isSaving
                    ? "Guardando..."
                    : hasPendingChanges
                      ? "Save changes"
                      : "No hay cambios pendientes"
                }
                arrow
                placement="bottom"
              >
                <span>
                  <IconButton
                    onClick={async () => {
                      if (onSave) {
                        try {
                          await onSave();
                        } catch (error) {
                          // Error is already handled in handleSaveTab with snackbar
                          console.error('[TabPanel] Error saving tab:', error);
                        }
                      }
                    }}
                    disabled={isSaving || !hasPendingChanges}
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: hasPendingChanges
                        ? (theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.main, 0.9)
                            : theme.palette.primary.main)
                        : colors.BUTTON_BG,
                      color: hasPendingChanges
                        ? theme.palette.primary.contrastText
                        : colors.BUTTON_TEXT,
                      border: `1px solid ${
                        hasPendingChanges ? theme.palette.primary.main : colors.BORDER
                      }`,
                      "&:hover": {
                        backgroundColor: hasPendingChanges
                          ? (theme.palette.mode === "dark"
                              ? alpha(theme.palette.primary.main, 1)
                              : theme.palette.primary.dark)
                          : colors.BUTTON_BG_HOVER,
                        transform: hasPendingChanges ? "scale(1.05)" : "scale(1)",
                      },
                      "&:disabled": {
                        backgroundColor: colors.BUTTON_BG,
                        color: colors.BUTTON_TEXT,
                        opacity: 0.5,
                        borderColor: colors.BORDER,
                      },
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: hasPendingChanges
                        ? (theme.palette.mode === "dark"
                            ? `0 2px 6px ${alpha(theme.palette.primary.main, 0.4)}`
                            : `0 2px 4px ${alpha(theme.palette.primary.main, 0.3)}`)
                        : (theme.palette.mode === "dark"
                            ? `0 1px 3px ${alpha(theme.palette.common.black, 0.2)}`
                            : `0 1px 2px ${alpha(theme.palette.common.black, 0.1)}`),
                    }}
                  >
                    {isSaving ? (
                      <CircularProgress size={16} sx={{ color: "inherit" }} />
                    ) : (
                      <SaveIcon sx={{ fontSize: 16 }} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )}
          {children}
        </Box>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if relevant props changed
  return (
    prevProps.value === nextProps.value &&
    prevProps.index === nextProps.index &&
    prevProps.isSaving === nextProps.isSaving &&
    prevProps.hasPendingChanges === nextProps.hasPendingChanges &&
    prevProps.onSave === nextProps.onSave &&
    prevProps.children === nextProps.children
  );
});

function a11yProps(index: number) {
  return {
    id: `plan-tab-${index}`,
    "aria-controls": `plan-tabpanel-${index}`,
  };
}

function PlanLeftPaneComponent({
  name,
  owner,
  startDate,
  endDate,
  id,
  description,
  status,
  productId,
  originalProductId,
  itOwner,
  featureIds = [], // Add this with default
  components = [], // Add this with default
  calendarIds = [],
  references = [],
  onNameChange,
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
  onSaveTab,
  isSaving = false,
  hasTabChanges = {},
  planUpdatedAt,
  plan,
}: PlanLeftPaneProps) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  
  // Local state for all fields to avoid re-renders on every keystroke/change
  // Update parent state debounced to reduce re-renders
  const [localName, setLocalName] = useState(name);
  const [localDescription, setLocalDescription] = useState(description || "");
  const [localStatus, setLocalStatus] = useState(status);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localProductId, setLocalProductId] = useState<string | undefined>(productId);
  const [localItOwner, setLocalItOwner] = useState<string | undefined>(itOwner);
  
  // Refs for original values and timeouts
  const originalNameRef = useRef(name);
  const originalDescriptionRef = useRef(description || "");
  const originalStatusRef = useRef(status);
  const originalStartDateRef = useRef(startDate);
  const originalEndDateRef = useRef(endDate);
  const originalProductIdRef = useRef(productId);
  const originalItOwnerRef = useRef(itOwner);
  
  // Timeouts for debouncing text inputs (Selects don't need debounce)
  const nameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startDateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const endDateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sync local state when props change externally (e.g., after save)
  useEffect(() => {
    const newName = name;
    const newDescription = description || "";
    const newStatus = status;
    const newStartDate = startDate;
    const newEndDate = endDate;
    const newProductId = productId;
    const newItOwner = itOwner;
    
    setLocalName(newName);
    setLocalDescription(newDescription);
    setLocalStatus(newStatus);
    setLocalStartDate(newStartDate);
    setLocalEndDate(newEndDate);
    setLocalProductId(newProductId);
    setLocalItOwner(newItOwner);
    
    originalNameRef.current = newName;
    originalDescriptionRef.current = newDescription;
    originalStatusRef.current = newStatus;
    originalStartDateRef.current = newStartDate;
    originalEndDateRef.current = newEndDate;
    originalProductIdRef.current = newProductId;
    originalItOwnerRef.current = newItOwner;
  }, [name, description, status, startDate, endDate, productId, itOwner]);
  
  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      [nameTimeoutRef, descriptionTimeoutRef, startDateTimeoutRef, endDateTimeoutRef].forEach(ref => {
        if (ref.current) {
          clearTimeout(ref.current);
        }
      });
    };
  }, []);
  
  // Calculate if any field has changed locally (for save button state)
  // This avoids waiting for parent state update
  const hasLocalChanges = useMemo(() => {
    return (
      localName !== originalNameRef.current ||
      localDescription !== originalDescriptionRef.current ||
      localStatus !== originalStatusRef.current ||
      localStartDate !== originalStartDateRef.current ||
      localEndDate !== originalEndDateRef.current ||
      localProductId !== originalProductIdRef.current ||
      localItOwner !== originalItOwnerRef.current
    );
  }, [localName, localDescription, localStatus, localStartDate, localEndDate, localProductId, localItOwner]);

  // Load products from API (Products maintenance table)
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  
  // Load IT Owners from maintenance API
  const { data: itOwners = [], isLoading: isLoadingITOwners } = useITOwners();
  
  // Query client for prefetching features
  const queryClient = useQueryClient();
  
  // Prefetch features when productId changes to reduce loading delay
  useEffect(() => {
    if (productId) {
      // Prefetch features in the background for the selected product
      // This will populate the cache so when the Features tab is opened,
      // data will be available immediately
      queryClient.prefetchQuery({
        queryKey: ['features', 'list', productId],
        queryFn: () => featuresService.getAll(productId),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [productId, queryClient]);

  // Validate that the current values exist in the available options
  // If not, reset to empty to prevent MUI "out-of-range value" warnings
  // If options are empty/loading, use empty string to avoid MUI errors
  // Use local values for immediate UI feedback
  const validProductId = useMemo(() => {
    if (!localProductId) return "";
    // If products are still loading, use empty to avoid MUI error
    // The value will be restored once products load (via useEffect sync)
    if (isLoadingProducts || products.length === 0) return "";
    const exists = products.some((p) => p.id === localProductId);
    return exists ? localProductId : "";
  }, [localProductId, products, isLoadingProducts]);

  const validItOwner = useMemo(() => {
    if (!localItOwner) return "";
    // If IT owners are still loading, use empty to avoid MUI error
    // The value will be restored once IT owners load (via useEffect sync)
    if (isLoadingITOwners) return "";
    // If IT owners have loaded, validate
    const exists = itOwners.some((o) => o.id === localItOwner);
    return exists ? localItOwner : "";
  }, [localItOwner, itOwners, isLoadingITOwners]);

  // Sync local state when validation detects invalid values (only after options have loaded)
  useEffect(() => {
    // Only reset if products have finished loading and the value is invalid
    if (!isLoadingProducts && products.length > 0 && localProductId && validProductId !== localProductId) {
      setLocalProductId(undefined);
      if (onProductChange) {
        onProductChange("");
      }
    }
  }, [localProductId, validProductId, products.length, isLoadingProducts, onProductChange]);

  useEffect(() => {
    // Only reset if IT owners have finished loading and the value is invalid
    if (!isLoadingITOwners && localItOwner && validItOwner !== localItOwner) {
      setLocalItOwner(undefined);
      if (onITOwnerChange) {
        onITOwnerChange("");
      }
    }
  }, [localItOwner, validItOwner, isLoadingITOwners, onITOwnerChange]);

  // Calculate duration in days - memoized to avoid recalculation on every render
  // Use local dates for immediate UI feedback
  const duration = useMemo(() => {
    const startTime = new Date(localStartDate).getTime();
    const endTime = new Date(localEndDate).getTime();
    const diffTime = Math.abs(endTime - startTime);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [localStartDate, localEndDate]);

  // Format date range using browser locale (dates are in UTC) - memoized
  // Use local dates for immediate UI feedback
  const formattedDateRange = useMemo(() => {
    return `${formatDateLocal(localStartDate, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${formatDateLocal(localEndDate, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }, [localStartDate, localEndDate]);

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
      {/* Tabs Header - Fixed - Compact Design */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          flexShrink: 0,
          height: 40,
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
            minHeight: 40,
            height: 40,
            "& .MuiTabs-flexContainer": {
              gap: 0,
              height: "100%",
              alignItems: "center",
            },
            "& .MuiTab-root": {
              minHeight: 40,
              height: 40,
              minWidth: "auto",
              maxWidth: "none",
              py: 0,
              px: 1.25,
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
          <TabPanel 
          value={tabValue} 
          index={0}
          onSave={onSaveTab ? () => onSaveTab(0) : undefined}
          isSaving={isSaving}
          hasPendingChanges={(hasTabChanges[0] || false) || hasLocalChanges}
        >
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack spacing={1.5} sx={{ width: "100%" }}>
              {/* Plan Name */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  Plan Name <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>
                <TextField
                  id="plan-name-input"
                  name="planName"
                  fullWidth
                  value={localName}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Update local state immediately for responsive UI
                    setLocalName(newValue);
                    
                    // Debounce parent update to reduce re-renders (100ms delay)
                    if (nameTimeoutRef.current) {
                      clearTimeout(nameTimeoutRef.current);
                    }
                    
                    nameTimeoutRef.current = setTimeout(() => {
                      if (onNameChange && newValue !== name) {
                        onNameChange(newValue);
                      }
                    }, 100);
                  }}
                  onBlur={(e) => {
                    // Clear any pending timeout
                    if (nameTimeoutRef.current) {
                      clearTimeout(nameTimeoutRef.current);
                      nameTimeoutRef.current = null;
                    }
                    
                    // Immediately propagate to parent when user finishes editing
                    if (onNameChange && e.target.value !== name) {
                      onNameChange(e.target.value);
                    }
                  }}
                  placeholder="Plan name..."
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.6875rem",
                      bgcolor: theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.5)
                        : "background.paper",
                      "& input": {
                        py: 0.625,
                      },
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
              </Box>

              {/* Description */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  Description
                </Typography>
                <TextField
                  id="plan-description-input"
                  name="planDescription"
                  fullWidth
                  multiline
                  rows={3}
                  value={localDescription}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Update local state immediately for responsive UI
                    setLocalDescription(newValue);
                    
                    // Debounce parent update to reduce re-renders (100ms delay for better responsiveness)
                    if (descriptionTimeoutRef.current) {
                      clearTimeout(descriptionTimeoutRef.current);
                    }
                    
                    descriptionTimeoutRef.current = setTimeout(() => {
                      if (onDescriptionChange && newValue !== description) {
                        onDescriptionChange(newValue);
                      }
                    }, 100);
                  }}
                  onBlur={(e) => {
                    // Clear any pending timeout
                    if (descriptionTimeoutRef.current) {
                      clearTimeout(descriptionTimeoutRef.current);
                      descriptionTimeoutRef.current = null;
                    }
                    
                    // Immediately propagate to parent when user finishes editing
                    if (onDescriptionChange && e.target.value !== description) {
                      onDescriptionChange(e.target.value);
                    }
                  }}
                  placeholder="Release plan description..."
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.6875rem",
                      bgcolor: theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.5)
                        : "background.paper",
                      "& textarea": {
                        py: 0.625,
                      },
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
              </Box>

              {/* Status */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  Status <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>
                <Select
                  id="plan-status-select"
                  name="planStatus"
                  value={localStatus}
                  onChange={(e: SelectChangeEvent) => {
                    const newValue = e.target.value as PlanStatus;
                    // Update local state immediately for responsive UI
                    setLocalStatus(newValue);
                    
                    // Immediately propagate to parent (Select changes are less frequent, no debounce needed)
                    if (onStatusChange && newValue !== status) {
                      onStatusChange(newValue);
                    }
                  }}
                  displayEmpty
                  size="small"
                  sx={{
                    width: "100%",
                    fontSize: "0.6875rem",
                    bgcolor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.5)
                      : "background.paper",
                    "& .MuiSelect-select": {
                      py: 0.625,
                      fontSize: "0.6875rem",
                    },
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
                  <MenuItem value="planned" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>Planned</MenuItem>
                  <MenuItem value="in_progress" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>In Progress</MenuItem>
                  <MenuItem value="done" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>Done</MenuItem>
                  <MenuItem value="paused" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>Paused</MenuItem>
                </Select>
              </Box>

              {/* Period - Date Range */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  Period <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>
                <Stack 
                  direction={{ xs: "column", sm: "row" }} 
                  spacing={1}
                >
                  <TextField
                    id="plan-start-date-input"
                    name="planStartDate"
                    type="date"
                    value={localStartDate}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Update local state immediately for responsive UI
                      setLocalStartDate(newValue);
                      
                      // Debounce parent update to reduce re-renders (100ms delay)
                      if (startDateTimeoutRef.current) {
                        clearTimeout(startDateTimeoutRef.current);
                      }
                      
                      startDateTimeoutRef.current = setTimeout(() => {
                        if (onStartDateChange && newValue !== startDate) {
                          onStartDateChange(newValue);
                        }
                      }, 100);
                    }}
                    onBlur={(e) => {
                      // Clear any pending timeout
                      if (startDateTimeoutRef.current) {
                        clearTimeout(startDateTimeoutRef.current);
                        startDateTimeoutRef.current = null;
                      }
                      
                      // Immediately propagate to parent when user finishes editing
                      if (onStartDateChange && e.target.value !== startDate) {
                        onStartDateChange(e.target.value);
                      }
                    }}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.6875rem",
                        bgcolor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.5)
                          : "background.paper",
                        "& input": {
                          py: 0.625,
                        },
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
                    id="plan-end-date-input"
                    name="planEndDate"
                    type="date"
                    value={localEndDate}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Update local state immediately for responsive UI
                      setLocalEndDate(newValue);
                      
                      // Debounce parent update to reduce re-renders (100ms delay)
                      if (endDateTimeoutRef.current) {
                        clearTimeout(endDateTimeoutRef.current);
                      }
                      
                      endDateTimeoutRef.current = setTimeout(() => {
                        if (onEndDateChange && newValue !== endDate) {
                          onEndDateChange(newValue);
                        }
                      }, 100);
                    }}
                    onBlur={(e) => {
                      // Clear any pending timeout
                      if (endDateTimeoutRef.current) {
                        clearTimeout(endDateTimeoutRef.current);
                        endDateTimeoutRef.current = null;
                      }
                      
                      // Immediately propagate to parent when user finishes editing
                      if (onEndDateChange && e.target.value !== endDate) {
                        onEndDateChange(e.target.value);
                      }
                    }}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.6875rem",
                        bgcolor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.5)
                          : "background.paper",
                        "& input": {
                          py: 0.625,
                        },
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
                    fontSize: "0.625rem",
                    color: theme.palette.text.secondary,
                    mt: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 400,
                  }}
                >
                  <span>{formattedDateRange}</span>
                  <span>•</span>
                  <span>{duration} {duration === 1 ? "day" : "days"}</span>
                </Typography>
              </Box>

              {/* Product */}
              {originalProductId ? (
                // Product is locked (already saved in BD) - show as read-only
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                      mb: 0.5,
                      display: "block",
                    }}
                  >
                    Product
                  </Typography>
                  <TextField
                    id="plan-product-display"
                    name="planProductId"
                    value={(() => {
                      const product = products.find((p) => p.id === originalProductId);
                      return product ? product.name : originalProductId;
                    })()}
                    fullWidth
                    size="small"
                    disabled
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.3)
                          : alpha(theme.palette.action.disabledBackground, 0.15),
                        borderRadius: 1,
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "0.6875rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        cursor: "default",
                        py: 0.625,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.divider, 0.15),
                        borderWidth: 1,
                      },
                    }}
                  />
                </Box>
              ) : (
                // Product can be selected (not yet saved)
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                      mb: 0.5,
                      display: "block",
                    }}
                  >
                    Product <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>
                  <Select
                    id="plan-product-select"
                    name="planProductId"
                    value={validProductId}
                    onChange={(e: SelectChangeEvent) => {
                      const newValue = e.target.value;
                      // Update local state immediately for responsive UI
                      setLocalProductId(newValue || undefined);
                      
                      // Immediately propagate to parent (Select changes are less frequent, no debounce needed)
                      if (onProductChange && newValue !== productId) {
                        onProductChange(newValue);
                      }
                    }}
                    displayEmpty
                    MenuProps={{
                      // Prevent aria-hidden issues by ensuring proper focus management
                      disableAutoFocusItem: true,
                      onClose: () => {
                        // Prevent aria-hidden warnings by ensuring proper focus management
                        if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
                          requestAnimationFrame(() => {
                            const activeElement = document.activeElement as HTMLElement;
                            if (activeElement && activeElement.blur) {
                              activeElement.blur();
                            }
                          });
                        } else {
                          setTimeout(() => {
                            const activeElement = document.activeElement as HTMLElement;
                            if (activeElement && activeElement.blur) {
                              activeElement.blur();
                            }
                          }, 0);
                        }
                      },
                    }}
                    renderValue={(selected) => {
                      if (!selected || selected === "") {
                        return <em style={{ color: theme.palette.text.secondary, fontStyle: "normal", fontSize: "0.6875rem" }}>Select a product</em>;
                      }
                      const product = products.find((p) => p.id === selected);
                      return <span style={{ fontSize: "0.6875rem" }}>{product ? product.name : selected}</span>;
                    }}
                    size="small"
                    sx={{
                      fontSize: "0.6875rem",
                      bgcolor: theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.3)
                        : "background.paper",
                      "& .MuiSelect-select": {
                        py: 0.625,
                        fontSize: "0.6875rem",
                      },
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
                    <MenuItem value="" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                      <em>None</em>
                    </MenuItem>
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id} sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}

              {/* IT Owner */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  IT Owner
                </Typography>
                <Select
                  id="plan-it-owner-select"
                  name="planItOwner"
                  value={validItOwner}
                  onChange={(e: SelectChangeEvent) => {
                    const newValue = e.target.value;
                    // Update local state immediately for responsive UI
                    setLocalItOwner(newValue || undefined);
                    
                    // Immediately propagate to parent (Select changes are less frequent, no debounce needed)
                    if (onITOwnerChange && newValue !== itOwner) {
                      onITOwnerChange(newValue);
                    }
                  }}
                  displayEmpty
                  MenuProps={{
                    // Prevent aria-hidden issues by ensuring proper focus management
                    disableAutoFocusItem: true,
                    onClose: () => {
                      // Small delay to ensure proper focus handling
                      setTimeout(() => {
                        const activeElement = document.activeElement as HTMLElement;
                        if (activeElement && activeElement.blur) {
                          activeElement.blur();
                        }
                      }, 0);
                    },
                  }}
                  renderValue={(selected) => {
                    if (!selected || selected === "") {
                      return <em style={{ color: theme.palette.text.secondary, fontStyle: "normal", fontSize: "0.6875rem" }}>None</em>;
                    }
                    const owner = itOwners.find((o) => o.id === selected);
                    return <span style={{ fontSize: "0.6875rem" }}>{owner ? owner.name : selected}</span>;
                  }}
                  size="small"
                  sx={{
                    width: "100%",
                    fontSize: "0.6875rem",
                    bgcolor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.5)
                      : "background.paper",
                    "& .MuiSelect-select": {
                      py: 0.625,
                      fontSize: "0.6875rem",
                    },
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
                  <MenuItem value="" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                    <em>None</em>
                  </MenuItem>
                  {isLoadingITOwners ? (
                    <MenuItem disabled sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                      Loading...
                    </MenuItem>
                  ) : (
                    itOwners.map((owner) => (
                      <MenuItem key={owner.id} value={owner.id} sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                        {owner.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </Box>
            </Stack>
          </Box>
        </TabPanel>

        {/* Tab 2: Features */}
        <TabPanel 
          value={tabValue} 
          index={1}
          onSave={onSaveTab ? () => onSaveTab(1) : undefined}
          isSaving={isSaving}
          hasPendingChanges={hasTabChanges[1] || false}
        >
          <PlanFeaturesTab
            productId={productId}
            featureIds={featureIds}
            planId={id}
            planUpdatedAt={planUpdatedAt}
            plan={plan}
            onFeatureIdsChange={onFeatureIdsChange}
          />
        </TabPanel>

        {/* Tab 3: Components */}
        <TabPanel 
          value={tabValue} 
          index={2}
          onSave={onSaveTab ? () => onSaveTab(2) : undefined}
          isSaving={isSaving}
          hasPendingChanges={hasTabChanges[2] || false}
        >
          <PlanComponentsTab
            productId={productId}
            components={components}
            onComponentsChange={onComponentsChange}
          />
        </TabPanel>

        {/* Tab 4: Calendars */}
        <TabPanel 
          value={tabValue} 
          index={3}
          onSave={onSaveTab ? () => onSaveTab(3) : undefined}
          isSaving={isSaving}
          hasPendingChanges={hasTabChanges[3] || false}
        >
          <PlanCalendarsTab
            calendarIds={calendarIds}
            onCalendarIdsChange={onCalendarIdsChange}
          />
        </TabPanel>

        {/* Tab 5: References */}
        <TabPanel 
          value={tabValue} 
          index={4}
          onSave={onSaveTab ? () => onSaveTab(4) : undefined}
          isSaving={isSaving}
          hasPendingChanges={hasTabChanges[4] || false}
        >
          <PlanReferencesTab
            references={(() => {
              // Debug: Log references received by PlanLeftPane
              console.log('[PlanLeftPane] Passing references to PlanReferencesTab:', {
                references,
                referencesLength: references?.length,
                referencesType: typeof references,
                isArray: Array.isArray(references),
                firstReference: references?.[0],
              });
              return references;
            })()}
            onReferencesChange={onReferencesChange}
            onScrollToDate={onScrollToDate}
            phases={plan?.metadata?.phases || []}
            startDate={startDate}
            endDate={endDate}
            calendarIds={calendarIds}
          />
        </TabPanel>
      </Box>
    </Box>
  );
}

// Memoize PlanLeftPane to prevent unnecessary re-renders
// Only re-render if props actually change
const PlanLeftPane = memo(PlanLeftPaneComponent, (prevProps, nextProps) => {
  // Custom comparison - only re-render if relevant props changed
  return (
    prevProps.name === nextProps.name &&
    prevProps.description === nextProps.description &&
    prevProps.status === nextProps.status &&
    prevProps.productId === nextProps.productId &&
    prevProps.originalProductId === nextProps.originalProductId &&
    prevProps.itOwner === nextProps.itOwner &&
    prevProps.startDate === nextProps.startDate &&
    prevProps.endDate === nextProps.endDate &&
    prevProps.featureIds === nextProps.featureIds &&
    prevProps.components === nextProps.components &&
    prevProps.calendarIds === nextProps.calendarIds &&
    prevProps.references === nextProps.references &&
    prevProps.isSaving === nextProps.isSaving &&
    prevProps.hasTabChanges === nextProps.hasTabChanges &&
    // Compare handlers by reference (they should be stable with useCallback)
    prevProps.onNameChange === nextProps.onNameChange &&
    prevProps.onDescriptionChange === nextProps.onDescriptionChange &&
    prevProps.onStatusChange === nextProps.onStatusChange &&
    prevProps.onProductChange === nextProps.onProductChange &&
    prevProps.onITOwnerChange === nextProps.onITOwnerChange &&
    prevProps.onStartDateChange === nextProps.onStartDateChange &&
    prevProps.onEndDateChange === nextProps.onEndDateChange &&
    prevProps.onFeatureIdsChange === nextProps.onFeatureIdsChange &&
    prevProps.onComponentsChange === nextProps.onComponentsChange &&
    prevProps.onCalendarIdsChange === nextProps.onCalendarIdsChange &&
    prevProps.onReferencesChange === nextProps.onReferencesChange &&
    prevProps.onSaveTab === nextProps.onSaveTab
  );
});

export default PlanLeftPane;
