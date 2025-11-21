import { memo } from "react";
import { Button, Tooltip, Box } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { PhasesListStyles } from "../hooks/usePhasesListStyles";

export type AutoGenerateButtonProps = {
  readonly onAutoGenerate: () => void;
  readonly styles: PhasesListStyles;
};

export const AutoGenerateButton = memo(function AutoGenerateButton({
  onAutoGenerate,
  styles,
}: AutoGenerateButtonProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        mt: 2,
        px: 1,
      }}
    >
      <Tooltip title="Generar fases automáticamente" arrow>
        <Button
          size="small"
          variant="text"
          startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
          onClick={onAutoGenerate}
          sx={styles.getAutoGenerateButtonStyles()}
        >
          Auto Generate
        </Button>
      </Tooltip>
    </Box>
  );
});

