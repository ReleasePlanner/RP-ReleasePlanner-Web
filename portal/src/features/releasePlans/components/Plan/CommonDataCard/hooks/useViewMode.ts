import { useState } from "react";
import type { ViewMode } from "../types";

export function useViewMode(initialMode: ViewMode = "grid") {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
  };
}
