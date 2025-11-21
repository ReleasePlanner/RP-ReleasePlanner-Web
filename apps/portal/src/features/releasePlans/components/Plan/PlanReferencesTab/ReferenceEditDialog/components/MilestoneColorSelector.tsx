import { Box, Typography, Tooltip, Popover, useTheme, alpha } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { MILESTONE_COLORS } from "../constants";

export type MilestoneColorSelectorProps = {
  readonly milestoneColor: string;
  readonly useCustomColor: boolean;
  readonly customColor: string;
  readonly colorPickerAnchor: HTMLButtonElement | null;
  readonly onColorSelect: (color: string) => void;
  readonly onCustomColorClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  readonly onColorPickerClose: () => void;
  readonly onCustomColorChange: (color: string) => void;
};

export function MilestoneColorSelector({
  milestoneColor,
  useCustomColor,
  customColor,
  colorPickerAnchor,
  onColorSelect,
  onCustomColorClick,
  onColorPickerClose,
  onCustomColorChange,
}: MilestoneColorSelectorProps) {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          fontSize: "0.8125rem",
          color: theme.palette.text.primary,
          mb: 1.5,
        }}
      >
        Color
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 1,
          alignItems: "center",
          overflowX: "auto",
          pb: 0.5,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: alpha(theme.palette.divider, 0.05),
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: alpha(theme.palette.divider, 0.3),
            borderRadius: 3,
            "&:hover": {
              bgcolor: alpha(theme.palette.divider, 0.5),
            },
          },
        }}
      >
        {MILESTONE_COLORS.map((color) => {
          const isSelected = !useCustomColor && milestoneColor === color.value;
          return (
            <Tooltip key={color.value} title={color.label} arrow placement="top">
              <Box
                onClick={() => onColorSelect(color.value)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: color.value,
                  border: `2px solid ${
                    isSelected ? theme.palette.common.white : "transparent"
                  }`,
                  boxShadow: isSelected
                    ? `0 0 0 2px ${color.value}, 0 2px 6px ${alpha(color.value, 0.35)}`
                    : `0 1px 3px ${alpha(theme.palette.common.black, 0.12)}`,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  "&:hover": {
                    transform: "scale(1.12)",
                    boxShadow: `0 0 0 2px ${theme.palette.common.white}, 0 3px 10px ${alpha(color.value, 0.45)}`,
                  },
                  "&:active": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {isSelected && (
                  <CheckCircleIcon
                    sx={{
                      fontSize: 20,
                      color: "#fff",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          );
        })}
        <Tooltip title="Más colores" arrow placement="top">
          <Box
            onClick={onCustomColorClick}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: useCustomColor
                ? customColor
                : alpha(theme.palette.grey[400], 0.15),
              border: `2px solid ${
                useCustomColor
                  ? theme.palette.common.white
                  : alpha(theme.palette.divider, 0.2)
              }`,
              boxShadow: useCustomColor
                ? `0 0 0 2px ${customColor}, 0 2px 6px ${alpha(customColor, 0.35)}`
                : `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}`,
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                transform: "scale(1.12)",
                bgcolor: useCustomColor
                  ? customColor
                  : alpha(theme.palette.grey[400], 0.2),
                boxShadow: useCustomColor
                  ? `0 0 0 2px ${theme.palette.common.white}, 0 3px 10px ${alpha(customColor, 0.45)}`
                  : `0 2px 6px ${alpha(theme.palette.common.black, 0.15)}`,
              },
              "&:active": {
                transform: "scale(1.05)",
              },
            }}
          >
            {useCustomColor ? (
              <CheckCircleIcon
                sx={{
                  fontSize: 20,
                  color: "#fff",
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                }}
              />
            ) : (
              <MoreHorizIcon
                sx={{
                  fontSize: 20,
                  color: theme.palette.text.secondary,
                }}
              />
            )}
          </Box>
        </Tooltip>
      </Box>
      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={onColorPickerClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2.5,
              p: 2,
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          },
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 1.5,
              fontWeight: 500,
              fontSize: "0.75rem",
              color: theme.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Color personalizado
          </Typography>
          <input
            type="color"
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            style={{
              width: "100%",
              height: 48,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              display: "block",
            }}
          />
        </Box>
      </Popover>
    </Box>
  );
}

