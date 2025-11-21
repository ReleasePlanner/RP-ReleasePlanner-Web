import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions as MuiDialogActions,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import {
  LibraryBooks as LibraryBooksIcon,
  Create as CreateIcon,
} from "@mui/icons-material";
import { useBasePhases } from "../../../../api/hooks";
import type { PlanPhase } from "../../types";
import {
  useAddPhaseForm,
  usePhaseNameValidation,
  useAvailableBasePhases,
  useAddPhaseSubmit,
} from "./AddPhaseDialog/hooks";
import {
  TabPanel,
  DialogHeader,
  BasePhasesTab,
  NewPhaseTab,
  DialogActions,
} from "./AddPhaseDialog/components";

export type AddPhaseDialogProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (phases: PlanPhase[]) => void;
  readonly existingPhases?: PlanPhase[];
  readonly planStartDate?: string;
  readonly planEndDate?: string;
};

export default function AddPhaseDialog({
  open,
  onClose,
  onSubmit,
  existingPhases = [],
  planStartDate,
  planEndDate,
}: AddPhaseDialogProps) {
  const theme = useTheme();
  const { data: basePhases = [], isLoading: isLoadingBasePhases } =
    useBasePhases();

  // Form state
  const {
    tabValue,
    selectedBasePhaseIds,
    newPhaseName,
    newPhaseColor,
    error,
    isValidating,
    setTabValue,
    setNewPhaseName,
    setNewPhaseColor,
    setError,
    setIsValidating,
    handleBasePhaseToggle,
    handleSelectAllBasePhases,
  } = useAddPhaseForm(open);

  // Available base phases
  const { availableBasePhases, existingPhaseNames } = useAvailableBasePhases(
    basePhases,
    existingPhases
  );

  // Validation
  const { validatePhaseName } = usePhaseNameValidation(
    open,
    tabValue,
    newPhaseName,
    existingPhaseNames,
    setError,
    setIsValidating
  );

  // Submit handler
  const { handleSubmit } = useAddPhaseSubmit(
    tabValue,
    selectedBasePhaseIds,
    basePhases,
    newPhaseName,
    newPhaseColor,
    validatePhaseName,
    planStartDate
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const canSubmit =
    tabValue === 0
      ? selectedBasePhaseIds.size > 0
      : newPhaseName.trim() !== "" && !error && !isValidating;

  const handleSubmitClick = () => {
    handleSubmit(onSubmit, onClose);
  };

  const handleSelectAll = () => {
    handleSelectAllBasePhases(availableBasePhases);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`
                : `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: "hidden",
          },
        },
        backdrop: {
          TransitionComponent: Fade,
          transitionDuration: 200,
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          fontWeight: 600,
          fontSize: "1.25rem",
          color: theme.palette.text.primary,
        }}
      >
        <DialogHeader />
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2, pb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={setTabValue}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            mb: 0,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 48,
            },
          }}
        >
          <Tab
            icon={<LibraryBooksIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="From Maintenance"
            id="add-phase-tab-0"
            aria-controls="add-phase-tabpanel-0"
          />
          <Tab
            icon={<CreateIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="New Phase"
            id="add-phase-tab-1"
            aria-controls="add-phase-tabpanel-1"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <BasePhasesTab
            isLoading={isLoadingBasePhases}
            availableBasePhases={availableBasePhases}
            selectedBasePhaseIds={selectedBasePhaseIds}
            onPhaseToggle={handleBasePhaseToggle}
            onSelectAll={handleSelectAll}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <NewPhaseTab
            phaseName={newPhaseName}
            phaseColor={newPhaseColor}
            error={error}
            isValidating={isValidating}
            onNameChange={setNewPhaseName}
            onColorChange={setNewPhaseColor}
            onKeyDown={handleKeyDown}
          />
        </TabPanel>
      </DialogContent>

      <MuiDialogActions
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          gap: 1.5,
        }}
      >
        <DialogActions
          tabValue={tabValue}
          selectedCount={selectedBasePhaseIds.size}
          canSubmit={canSubmit}
          onCancel={onClose}
          onSubmit={handleSubmitClick}
        />
      </MuiDialogActions>
    </Dialog>
  );
}
