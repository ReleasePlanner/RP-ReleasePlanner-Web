import { Box } from "@mui/material";
import { PlanIdChip } from "./PlanIdChip";
import { PlanNameDisplay } from "./PlanNameDisplay";
import { PlanNameInput } from "./PlanNameInput";
import type { SxProps, Theme } from "@mui/material";

export type PlanTitleProps = {
  readonly id: string;
  readonly name: string;
  readonly isEditing: boolean;
  readonly editValue: string;
  readonly idChipStyles?: SxProps<Theme>;
  readonly nameDisplayStyles?: SxProps<Theme>;
  readonly nameInputStyles?: SxProps<Theme>;
  readonly onStartEdit: () => void;
  readonly onEditChange: (value: string) => void;
  readonly onEditSave: () => void;
  readonly onEditCancel: () => void;
  readonly onEditKeyDown: (e: React.KeyboardEvent) => void;
};

export function PlanTitle({
  id,
  name,
  isEditing,
  editValue,
  idChipStyles,
  nameDisplayStyles,
  nameInputStyles,
  onStartEdit,
  onEditChange,
  onEditSave,
  onEditCancel,
  onEditKeyDown,
}: PlanTitleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "wrap",
      }}
    >
      <PlanIdChip id={id} sx={idChipStyles} />
      {isEditing ? (
        <PlanNameInput
          value={editValue}
          onChange={onEditChange}
          onBlur={onEditSave}
          onKeyDown={onEditKeyDown}
          sx={nameInputStyles}
        />
      ) : (
        <PlanNameDisplay
          id={id}
          name={name}
          onClick={onStartEdit}
          sx={nameDisplayStyles}
        />
      )}
    </Box>
  );
}

