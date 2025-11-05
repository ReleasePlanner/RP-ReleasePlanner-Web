import { useState } from "react";

export function useTabState(initialValue = 0) {
  const [activeTab, setActiveTab] = useState(initialValue);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return {
    activeTab,
    handleTabChange,
  };
}
