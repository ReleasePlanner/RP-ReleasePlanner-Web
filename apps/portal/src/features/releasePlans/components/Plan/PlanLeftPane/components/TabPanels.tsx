import { TabPanel } from "./TabPanel";
import { CommonDataTab } from "./CommonDataTab";
import { PlanFeaturesTab } from "../../PlanFeaturesTab/PlanFeaturesTab";
import { PlanComponentsTab } from "../../PlanComponentsTab/PlanComponentsTab";
import { PlanCalendarsTab } from "../../PlanCalendarsTab/PlanCalendarsTab";
import { PlanReferencesTab } from "../../PlanReferencesTab/PlanReferencesTab";
import type {
  PlanStatus,
  PlanComponent,
  PlanReference,
  Plan,
} from "../../../../types";

export type TabPanelsProps = {
  readonly tabValue: number;
  readonly name: string;
  readonly description?: string;
  readonly status: PlanStatus;
  readonly startDate: string;
  readonly endDate: string;
  readonly id: string;
  readonly productId?: string;
  readonly originalProductId?: string;
  readonly itOwner?: string;
  readonly featureIds?: string[];
  readonly components?: PlanComponent[];
  readonly calendarIds?: string[];
  readonly references?: PlanReference[];
  readonly hasLocalChanges: boolean;
  readonly isSaving: boolean;
  readonly hasTabChanges: Record<number, boolean>;
  readonly planUpdatedAt?: string | Date;
  readonly plan?: Plan;
  readonly onNameChange?: (name: string) => void;
  readonly onDescriptionChange?: (description: string) => void;
  readonly onStatusChange?: (status: PlanStatus) => void;
  readonly onStartDateChange?: (date: string) => void;
  readonly onEndDateChange?: (date: string) => void;
  readonly onProductChange: (productId: string) => void;
  readonly onITOwnerChange?: (itOwnerId: string) => void;
  readonly onFeatureIdsChange?: (featureIds: string[]) => void;
  readonly onComponentsChange?: (components: PlanComponent[]) => void;
  readonly onCalendarIdsChange?: (calendarIds: string[]) => void;
  readonly onReferencesChange?: (references: PlanReference[]) => void;
  readonly onScrollToDate?: (date: string) => void;
  readonly onSaveTab?: (tabIndex: number) => Promise<void>;
};

export function TabPanels({
  tabValue,
  name,
  description,
  status,
  startDate,
  endDate,
  id,
  productId,
  originalProductId,
  itOwner,
  featureIds = [],
  components = [],
  calendarIds = [],
  references = [],
  hasLocalChanges,
  isSaving,
  hasTabChanges,
  planUpdatedAt,
  plan,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onProductChange,
  onITOwnerChange,
  onFeatureIdsChange,
  onComponentsChange,
  onCalendarIdsChange,
  onReferencesChange,
  onScrollToDate,
  onSaveTab,
}: TabPanelsProps) {
  return (
    <>
      {/* Tab 1: Common Data */}
      <TabPanel
        value={tabValue}
        index={0}
        onSave={onSaveTab ? () => onSaveTab(0) : undefined}
        isSaving={isSaving}
        hasPendingChanges={(hasTabChanges[0] || false) || hasLocalChanges}
      >
        <CommonDataTab
          name={name}
          description={description}
          status={status}
          startDate={startDate}
          endDate={endDate}
          productId={productId}
          originalProductId={originalProductId}
          itOwner={itOwner}
          onNameChange={onNameChange}
          onDescriptionChange={onDescriptionChange}
          onStatusChange={onStatusChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onProductChange={onProductChange}
          onITOwnerChange={onITOwnerChange}
        />
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
          references={references}
          onReferencesChange={onReferencesChange}
          onScrollToDate={onScrollToDate}
          phases={plan?.metadata?.phases || []}
          startDate={startDate}
          endDate={endDate}
          calendarIds={calendarIds}
        />
      </TabPanel>
    </>
  );
}

