import { 
  Box, 
  IconButton, 
  ListItem, 
  ListItemText, 
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

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
  return (
    <ListItem
      disableGutters
      disablePadding
      dense
      sx={{
        minHeight: "unset",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 0,
        pr: 0.5,
      }}
    >
      {/* Color indicator */}
      <Box
        sx={{
          width: "4px",
          height: "70%",
          minHeight: "24px",
          bgcolor: phaseColor,
          borderRadius: "2px",
          mr: 1.25,
          flexShrink: 0,
          opacity: 0.85,
          boxShadow: `0 0 0 1px ${alpha(phaseColor, 0.2)}`,
          transition: "opacity 0.2s ease",
          "&:hover": {
            opacity: 1,
          },
        }}
      />
      
      <ListItemText
        primary={name}
        secondary={secondary}
        primaryTypographyProps={{
          variant: "body2",
          sx: {
            fontSize: "0.8125rem",
            fontWeight: 500,
            lineHeight: 1.4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: isDark
              ? alpha(theme.palette.text.primary, 0.95)
              : theme.palette.text.primary,
          },
        }}
        secondaryTypographyProps={{
          variant: "caption",
          sx: {
            fontSize: "0.6875rem",
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mt: 0.25,
            color: isDark
              ? alpha(theme.palette.text.secondary, 0.7)
              : theme.palette.text.secondary,
          },
        }}
        sx={{
          my: 0,
          py: 0,
          pr: 0.5,
          minWidth: 0,
          flex: "1 1 0%",
        }}
      />
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.25,
          flexShrink: 0,
          ml: 0.5,
        }}
      >
        {onView && (
          <Tooltip title="Ver" arrow placement="top">
            <IconButton
              size="small"
              aria-label="View phase"
              onClick={() => onView(id)}
              edge="end"
              sx={{
                padding: "4px",
                color: isDark
                  ? alpha(theme.palette.text.secondary, 0.7)
                  : theme.palette.text.secondary,
                "&:hover": {
                  bgcolor: isDark
                    ? alpha(theme.palette.action.hover, 0.08)
                    : alpha(theme.palette.action.hover, 0.05),
                  color: theme.palette.primary.main,
                },
                transition: "all 0.15s ease",
              }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="Editar" arrow placement="top">
          <IconButton
            size="small"
            aria-label="Edit phase"
            onClick={() => onEdit(id)}
            edge="end"
            sx={{
              padding: "4px",
              color: isDark
                ? alpha(theme.palette.text.secondary, 0.7)
                : theme.palette.text.secondary,
              "&:hover": {
                bgcolor: isDark
                  ? alpha(theme.palette.action.hover, 0.08)
                  : alpha(theme.palette.action.hover, 0.05),
                color: theme.palette.primary.main,
              },
              transition: "all 0.15s ease",
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
        
        {onDelete && (
          <Tooltip title="Eliminar" arrow placement="top">
            <IconButton
              size="small"
              aria-label="Delete phase"
              onClick={() => onDelete(id)}
              edge="end"
              sx={{
                padding: "4px",
                color: isDark
                  ? alpha(theme.palette.text.secondary, 0.7)
                  : theme.palette.text.secondary,
                "&:hover": {
                  bgcolor: isDark
                    ? alpha(theme.palette.error.main, 0.15)
                    : alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                },
                transition: "all 0.15s ease",
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </ListItem>
  );
}
