// Distinct, accessible-friendly colors for phases
export const PHASE_COLORS: string[] = [
  "#185ABD", // blue
  "#217346", // green
  "#D83B01", // orange-red
  "#8E5EC9", // purple
  "#E81123", // red
  "#FF8C00", // orange
  "#0078D4", // azure
  "#00AD56", // teal/green
  "#B4009E", // magenta
  "#107C41", // green alt
];

export function getNextDistinctColor(
  usedColors: Array<string | undefined>,
  seedIndex = 0
): string {
  const used = new Set((usedColors || []).filter((c): c is string => !!c));
  for (const c of PHASE_COLORS) {
    if (!used.has(c)) return c;
  }
  // Fallback: rotate palette deterministically by seedIndex
  return PHASE_COLORS[seedIndex % PHASE_COLORS.length];
}
