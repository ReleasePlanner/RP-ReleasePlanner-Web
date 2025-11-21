import { Box, Tabs, Tab, useTheme, alpha } from "@mui/material";

export type PlanTabsProps = {
  readonly value: number;
  readonly onChange: (_event: React.SyntheticEvent, newValue: number) => void;
  readonly requiredFieldsFilled: boolean;
};

function a11yProps(index: number) {
  return {
    id: `plan-tab-${index}`,
    "aria-controls": `plan-tabpanel-${index}`,
  };
}

export function PlanTabs({
  value,
  onChange,
  requiredFieldsFilled,
}: PlanTabsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        flexShrink: 0,
        height: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        aria-label="Plan information tabs"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: 40,
          height: 40,
          "& .MuiTabs-flexContainer": {
            gap: 0,
            height: "100%",
            alignItems: "center",
          },
          "& .MuiTab-root": {
            minHeight: 40,
            height: 40,
            minWidth: "auto",
            maxWidth: "none",
            py: 0,
            px: 1.25,
            pt: 0,
            pb: 0,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.75rem",
            color:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.7)"
                : theme.palette.text.secondary,
            letterSpacing: "0.01em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: theme.transitions.create(
              ["color", "background-color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            "&:hover": {
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.95)"
                  : theme.palette.text.primary,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.action.hover, 0.08)
                  : alpha(theme.palette.action.hover, 0.04),
            },
            "&.Mui-selected": {
              color: theme.palette.primary.main,
              fontWeight: 600,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.primary.main, 0.04),
            },
            "&.Mui-disabled": {
              opacity: theme.palette.mode === "dark" ? 0.3 : 0.4,
            },
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: "2px 2px 0 0",
          },
        }}
      >
        <Tab label="Common Data" {...a11yProps(0)} />
        <Tab
          label="Features"
          {...a11yProps(1)}
          disabled={!requiredFieldsFilled}
        />
        <Tab
          label="Components"
          {...a11yProps(2)}
          disabled={!requiredFieldsFilled}
        />
        <Tab label="Calendars" {...a11yProps(3)} />
        <Tab label="References" {...a11yProps(4)} />
      </Tabs>
    </Box>
  );
}

