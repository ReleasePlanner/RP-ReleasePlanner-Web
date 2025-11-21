import { CardHeader } from "@mui/material";
import { usePlanNameEdit, usePlanHeaderStyles } from "./hooks";
import { PlanTitle, ExpandButton } from "./components";

export type PlanHeaderProps = {
  readonly id: string;
  readonly name: string;
  readonly expanded: boolean;
  readonly onToggleExpanded: () => void;
  readonly onNameChange?: (name: string) => void;
};

export default function PlanHeader({
  id,
  name,
  expanded,
  onToggleExpanded,
  onNameChange,
}: PlanHeaderProps) {
  // Edit hook
  const {
    isEditing,
    editValue,
    setEditValue,
    handleSave,
    handleCancel,
    handleStartEdit,
    handleKeyDown,
  } = usePlanNameEdit(name, onNameChange);

  // Styles hook
  const {
    headerStyles,
    idChipStyles,
    nameDisplayStyles,
    nameInputStyles,
    expandButtonStyles,
  } = usePlanHeaderStyles();

  return (
    <CardHeader
      sx={headerStyles}
      title={
        <PlanTitle
          id={id}
          name={name}
          isEditing={isEditing}
          editValue={editValue}
          idChipStyles={idChipStyles}
          nameDisplayStyles={nameDisplayStyles}
          nameInputStyles={nameInputStyles}
          onStartEdit={handleStartEdit}
          onEditChange={setEditValue}
          onEditSave={handleSave}
          onEditCancel={handleCancel}
          onEditKeyDown={handleKeyDown}
        />
      }
      action={
        <ExpandButton
          expanded={expanded}
          onToggle={onToggleExpanded}
          sx={expandButtonStyles}
        />
      }
    />
  );
}
