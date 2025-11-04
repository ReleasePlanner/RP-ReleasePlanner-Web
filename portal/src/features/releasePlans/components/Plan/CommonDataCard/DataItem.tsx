import { Box, Typography } from "@mui/material";

export interface DataItemProps {
  label: string;
  value: string;
}

export function DataItem({ label, value }: DataItemProps) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h6" component="div" sx={{ fontWeight: "medium" }}>
        {value}
      </Typography>
    </Box>
  );
}
