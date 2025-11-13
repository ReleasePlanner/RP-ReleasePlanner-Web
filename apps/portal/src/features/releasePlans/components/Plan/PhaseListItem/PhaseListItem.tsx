import { 
  Box, 
  IconButton, 
  ListItem, 
  ListItemText, 
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

export type PhaseListItemProps = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const phaseColor = color ?? theme.palette.secondary.main;
  const secondary =
    startDate && endDate ? `${startDate} → ${endDate}` : undefined;
  
  // Consistent icon button styles
  const iconButtonBaseStyles = {
    width: 24,
    height: 24,
    minWidth: 24,
    minHeight: 24,
    padding: 0.25,
    borderRadius: 0,
    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const iconBaseStyles = {
    fontSize: 14.5,
  };

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* Edit icon positioned at the left edge of color indicator */}
        <Tooltip title="Editar fase" arrow placement="top">
          <IconButton
            size="small"
            aria-label="Edit phase"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
            sx={{
              ...iconButtonBaseStyles,
              mr: 0.125,
              color: alpha(theme.palette.text.secondary, 0.65),
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
                color: theme.palette.primary.main,
              },
              "&:focus-visible": {
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.12),
                color: theme.palette.primary.main,
                outline: "none",
              },
              "&:active": {
                transform: "scale(0.95)",
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.15),
              },
            }}
          >
            <BorderColorOutlinedIcon sx={iconBaseStyles} />
          </IconButton>
        </Tooltip>
        
        {/* Color indicator */}
        <Box
          sx={{
            width: "3px",
            height: "56%",
            minHeight: "18px",
            bgcolor: phaseColor,
            borderRadius: "1.5px",
            flexShrink: 0,
            opacity: 0.85,
            transition: "opacity 0.2s ease",
          }}
        />
      </Box>
      
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
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.125,
          flexShrink: 0,
          ml: 0.5,
          minWidth: "fit-content",
          overflow: "visible",
          position: "relative",
          zIndex: 10,
        }}
      >
        {onView && (
          <Tooltip title="Ver detalles" arrow placement="top">
            <IconButton
              size="small"
              aria-label="View phase"
              onClick={(e) => {
                e.stopPropagation();
                onView(id);
              }}
              sx={{
                ...iconButtonBaseStyles,
                color: alpha(theme.palette.text.secondary, 0.65),
                "&:hover": {
                  bgcolor: alpha(theme.palette.info.main, isDark ? 0.12 : 0.08),
                  color: theme.palette.info.main,
                },
                "&:focus-visible": {
                  bgcolor: alpha(theme.palette.info.main, isDark ? 0.16 : 0.12),
                  color: theme.palette.info.main,
                  outline: "none",
                },
                "&:active": {
                  transform: "scale(0.95)",
                  bgcolor: alpha(theme.palette.info.main, isDark ? 0.2 : 0.15),
                },
              }}
            >
              <RemoveRedEyeOutlinedIcon sx={iconBaseStyles} />
            </IconButton>
          </Tooltip>
        )}
        
        {onDelete && (
          <Tooltip title="Eliminar fase" arrow placement="top">
            <IconButton
              size="small"
              aria-label="Delete phase"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              sx={{
                ...iconButtonBaseStyles,
                color: alpha(theme.palette.text.secondary, 0.65),
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, isDark ? 0.12 : 0.08),
                  color: theme.palette.error.main,
                },
                "&:focus-visible": {
                  bgcolor: alpha(theme.palette.error.main, isDark ? 0.16 : 0.12),
                  color: theme.palette.error.main,
                  outline: "none",
                },
                "&:active": {
                  transform: "scale(0.95)",
                  bgcolor: alpha(theme.palette.error.main, isDark ? 0.2 : 0.15),
                },
              }}
            >
              <DeleteOutlineIcon sx={iconBaseStyles} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </ListItem>
  );
}
