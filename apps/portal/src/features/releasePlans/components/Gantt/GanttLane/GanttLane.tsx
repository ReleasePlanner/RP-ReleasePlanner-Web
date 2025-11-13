import { useTheme } from "@mui/material/styles";

type GanttLaneProps = {
  top: number;
  height: number;
  index: number;
};

export default function GanttLane({ top, height, index }: GanttLaneProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
  // Use white overlay for dark mode, black overlay for light mode
  // Increased opacity for better visibility in dark mode
  const background = index % 2 === 0 
    ? (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.015)")
    : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)");
  
  const borderColor = isDark 
    ? "rgba(255,255,255,0.15)" // Increased opacity for better visibility
    : "rgba(0,0,0,0.06)";
  
  return (
    <div
      className="absolute left-0 right-0"
      aria-hidden
      style={{
        top,
        height,
        background,
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
      }}
    />
  );
}
