import { Box } from "@mui/material";

export interface TabLabelProps {
  icon: string;
  label: string;
}

export function TabLabel({ icon, label }: TabLabelProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span style={{ fontSize: "10px" }}>{label}</span>
    </Box>
  );
}
