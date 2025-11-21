import { ListItem } from "@mui/material";
import { PhaseHeader, PhaseContent, PhaseActions } from "./components";
import { usePhaseListItemStyles, usePhaseListItemTheme } from "./hooks";

export type PhaseListItemProps = {
  readonly id: string;
  readonly name: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly color?: string;
  readonly onEdit: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly onView?: (id: string) => void;
};

export default function PhaseListItem({
  id,
  name,
  startDate,
  endDate,
  color,
  onEdit,
  onDelete,
  onView,
}: PhaseListItemProps) {
  const styles = usePhaseListItemStyles();
  const { isDark, phaseColor } = usePhaseListItemTheme(color);

  return (
    <ListItem
      disableGutters
      disablePadding
      dense
      sx={{
        minHeight: "unset",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 0,
        pr: 0,
        pl: 0,
        px: 0,
        overflow: "visible",
      }}
    >
      <PhaseHeader
        phaseId={id}
        color={phaseColor}
        onEdit={onEdit}
        styles={styles}
        isDark={isDark}
      />

      <PhaseContent name={name} startDate={startDate} endDate={endDate} />

      <PhaseActions
        phaseId={id}
        onDelete={onDelete}
        onView={onView}
        styles={styles}
        isDark={isDark}
      />
    </ListItem>
  );
}
