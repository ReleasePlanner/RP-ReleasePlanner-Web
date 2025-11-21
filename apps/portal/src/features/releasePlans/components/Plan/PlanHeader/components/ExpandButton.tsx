import { IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material";

export type ExpandButtonProps = {
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly sx?: SxProps<Theme>;
};

export function ExpandButton({ expanded, onToggle, sx }: ExpandButtonProps) {
  const theme = useTheme();

  return (
    <Tooltip
      title={expanded ? "Collapse plan" : "Expand plan"}
      placement="top"
      arrow
    >
      <IconButton
        onClick={onToggle}
        aria-label={expanded ? "Collapse plan" : "Expand plan"}
        aria-expanded={expanded}
        size="medium"
        sx={{
          ...sx,
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        <ExpandMore />
      </IconButton>
    </Tooltip>
  );
}

