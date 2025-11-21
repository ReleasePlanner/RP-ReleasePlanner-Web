import { memo, useMemo } from "react";
import { ListItemText, useTheme } from "@mui/material";

export type PhaseContentProps = {
  readonly name: string;
  readonly startDate?: string;
  readonly endDate?: string;
};

export const PhaseContent = memo(function PhaseContent({
  name,
  startDate,
  endDate,
}: PhaseContentProps) {
  const theme = useTheme();

  const secondary = useMemo(
    () => (startDate && endDate ? `${startDate} → ${endDate}` : undefined),
    [startDate, endDate]
  );

  return (
    <ListItemText
      primary={name}
      secondary={secondary}
      primaryTypographyProps={{
        variant: "body2",
        sx: {
          fontSize: "0.8125rem",
          fontWeight: 500,
          lineHeight: 1.5,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: theme.palette.text.primary,
          letterSpacing: "-0.01em",
        },
      }}
      secondaryTypographyProps={{
        variant: "caption",
        sx: {
          fontSize: "0.6875rem",
          lineHeight: 1.4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          mt: 0.25,
          color: theme.palette.text.secondary,
          opacity: 0.8,
        },
      }}
      sx={{
        my: 0,
        py: 0,
        pr: 0,
        pl: 0.25,
        minWidth: 0,
        flex: "1 1 0%",
        overflow: "hidden",
        maxWidth: `calc(100% - 85px)`,
      }}
    />
  );
});

