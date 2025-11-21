import { memo } from "react";
import { Box } from "@mui/material";

export type PhaseColorIndicatorProps = {
  readonly color: string;
};

export const PhaseColorIndicator = memo(function PhaseColorIndicator({
  color,
}: PhaseColorIndicatorProps) {
  return (
    <Box
      sx={{
        width: "3px",
        height: "56%",
        minHeight: "18px",
        bgcolor: color,
        borderRadius: "1.5px",
        flexShrink: 0,
        opacity: 0.85,
        transition: "opacity 0.2s ease",
      }}
    />
  );
});

