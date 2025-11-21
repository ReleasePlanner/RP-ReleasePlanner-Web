import { useState, useEffect } from "react";

export function usePlanNameEdit(
  name: string,
  onNameChange?: (name: string) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);

  // Sync editValue when name prop changes (but not when editing)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(name);
    }
  }, [name, isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== name && onNameChange) {
      onNameChange(editValue.trim());
    }
    setIsEditing(false);
    setEditValue(name);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(name);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return {
    isEditing,
    editValue,
    setEditValue,
    handleSave,
    handleCancel,
    handleStartEdit,
    handleKeyDown,
  };
}

