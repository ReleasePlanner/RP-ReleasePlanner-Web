import { useState, memo } from "react";
import { Box, useTheme } from "@mui/material";
import { useLocalState, useLocalChanges, useFeaturePrefetch } from "./hooks";
import { PlanTabs, TabPanels } from "./components";
import type {
  PlanStatus,
  PlanComponent,
  PlanReference,
  Plan,
} from "../../../types";

export type PlanLeftPaneProps = {
  readonly name: string;
  readonly owner: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly id: string;
  readonly description?: string;
  readonly status: PlanStatus;
  readonly productId?: string;
  readonly originalProductId?: string; // Product ID from saved plan (BD) - if exists, product is locked
  readonly itOwner?: string;
  readonly featureIds?: string[];
  readonly components?: PlanComponent[];
  readonly calendarIds?: string[];
  readonly references?: PlanReference[];
  readonly onNameChange?: (name: string) => void;
  readonly onProductChange: (productId: string) => void;
  readonly onDescriptionChange?: (description: string) => void;
  readonly onStatusChange?: (status: PlanStatus) => void;
  readonly onITOwnerChange?: (itOwnerId: string) => void;
  readonly onStartDateChange?: (date: string) => void;
  readonly onEndDateChange?: (date: string) => void;
  readonly onFeatureIdsChange?: (featureIds: string[]) => void;
  readonly onComponentsChange?: (components: PlanComponent[]) => void;
  readonly onCalendarIdsChange?: (calendarIds: string[]) => void;
  readonly onReferencesChange?: (references: PlanReference[]) => void;
  readonly onScrollToDate?: (date: string) => void;
  readonly onSaveTab?: (tabIndex: number) => Promise<void>;
  readonly isSaving?: boolean;
  readonly hasTabChanges?: Record<number, boolean>;
  readonly planUpdatedAt?: string | Date; // Plan updatedAt for optimistic locking
  readonly plan?: Plan; // Full plan object for optimistic locking
};

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
  featureIds = [],
  components = [],
  calendarIds = [],
  references = [],
  onNameChange,
  onProductChange,
  onDescriptionChange,
  onStatusChange,
  onITOwnerChange,
  onStartDateChange,
  onEndDateChange,
  onFeatureIdsChange,
  onComponentsChange,
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

  // Local state hook
  const {
    localName,
    localDescription,
    localStatus,
    localStartDate,
    localEndDate,
    localProductId,
    localItOwner,
    originalNameRef,
    originalDescriptionRef,
    originalStatusRef,
    originalStartDateRef,
    originalEndDateRef,
    originalProductIdRef,
    originalItOwnerRef,
  } = useLocalState(
    name,
    description,
    status,
    startDate,
    endDate,
    productId,
    itOwner
  );

  // Calculate local changes
  const hasLocalChanges = useLocalChanges(
    localName,
    localDescription,
    localStatus,
    localStartDate,
    localEndDate,
    localProductId,
    localItOwner,
    originalNameRef,
    originalDescriptionRef,
    originalStatusRef,
    originalStartDateRef,
    originalEndDateRef,
    originalProductIdRef,
    originalItOwnerRef
  );

  // Prefetch features when productId changes
  useFeaturePrefetch(productId);

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
      <PlanTabs
        value={tabValue}
        onChange={handleTabChange}
        requiredFieldsFilled={requiredFieldsFilled}
      />

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
        <TabPanels
          tabValue={tabValue}
          name={name}
          description={description}
          status={status}
          startDate={startDate}
          endDate={endDate}
          id={id}
          productId={productId}
          originalProductId={originalProductId}
          itOwner={itOwner}
          featureIds={featureIds}
          components={components}
          calendarIds={calendarIds}
          references={references}
          hasLocalChanges={hasLocalChanges}
          isSaving={isSaving}
          hasTabChanges={hasTabChanges}
          planUpdatedAt={planUpdatedAt}
          plan={plan}
          onNameChange={onNameChange}
          onDescriptionChange={onDescriptionChange}
          onStatusChange={onStatusChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onProductChange={onProductChange}
          onITOwnerChange={onITOwnerChange}
          onFeatureIdsChange={onFeatureIdsChange}
          onComponentsChange={onComponentsChange}
          onCalendarIdsChange={onCalendarIdsChange}
          onReferencesChange={onReferencesChange}
          onScrollToDate={onScrollToDate}
          onSaveTab={onSaveTab}
        />
      </Box>
    </Box>
  );
}

// Helper functions to reduce cognitive complexity of memo comparison
function compareBasicProps(
  prevProps: PlanLeftPaneProps,
  nextProps: PlanLeftPaneProps
): boolean {
  return (
    prevProps.name === nextProps.name &&
    prevProps.description === nextProps.description &&
    prevProps.status === nextProps.status &&
    prevProps.startDate === nextProps.startDate &&
    prevProps.endDate === nextProps.endDate
  );
}

function compareIdProps(
  prevProps: PlanLeftPaneProps,
  nextProps: PlanLeftPaneProps
): boolean {
  return (
    prevProps.productId === nextProps.productId &&
    prevProps.originalProductId === nextProps.originalProductId &&
    prevProps.itOwner === nextProps.itOwner
  );
}

function compareArrayProps(
  prevProps: PlanLeftPaneProps,
  nextProps: PlanLeftPaneProps
): boolean {
  return (
    prevProps.featureIds === nextProps.featureIds &&
    prevProps.components === nextProps.components &&
    prevProps.calendarIds === nextProps.calendarIds &&
    prevProps.references === nextProps.references
  );
}

function compareStateProps(
  prevProps: PlanLeftPaneProps,
  nextProps: PlanLeftPaneProps
): boolean {
  return (
    prevProps.isSaving === nextProps.isSaving &&
    prevProps.hasTabChanges === nextProps.hasTabChanges
  );
}

function compareHandlers(
  prevProps: PlanLeftPaneProps,
  nextProps: PlanLeftPaneProps
): boolean {
  return (
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
}

// Memoize PlanLeftPane to prevent unnecessary re-renders
const PlanLeftPane = memo(PlanLeftPaneComponent, (prevProps, nextProps) => {
  return (
    compareBasicProps(prevProps, nextProps) &&
    compareIdProps(prevProps, nextProps) &&
    compareArrayProps(prevProps, nextProps) &&
    compareStateProps(prevProps, nextProps) &&
    compareHandlers(prevProps, nextProps)
  );
});

export default PlanLeftPane;
