import { useState, useEffect } from "react";
import { MILESTONE_COLORS } from "../constants";
import type { PlanReference, PlanReferenceType, PlanReferenceFile } from "../../../../../types";

export function useReferenceForm(
  open: boolean,
  reference: PlanReference | null,
  isCreating: boolean
) {
  const [type, setType] = useState<PlanReferenceType>("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneColor, setMilestoneColor] = useState("#F44336");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [milestonePhaseId, setMilestonePhaseId] = useState<string>("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState("#F44336");
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLButtonElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<PlanReferenceFile[]>([]);

  // Initialize form when dialog opens or reference changes
  useEffect(() => {
    if (open) {
      if (reference) {
        setType(reference.type);
        setTitle(reference.title);
        setUrl(reference.url || "");
        setDescription(reference.description || "");
        const refColor = reference.milestoneColor || "#F44336";
        setMilestoneColor(refColor);
        setCustomColor(refColor);
        setUseCustomColor(!MILESTONE_COLORS.some((c) => c.value === refColor));
        setMilestoneDate(reference.date || "");
        setMilestonePhaseId(reference.phaseId || "");
        setMilestoneDescription(reference.description || "");
        setSelectedFiles(reference.files || []);
      } else {
        setType("link");
        setTitle("");
        setUrl("");
        setDescription("");
        setMilestoneColor("#F44336");
        setCustomColor("#F44336");
        setUseCustomColor(false);
        setMilestoneDate("");
        setMilestonePhaseId("");
        setMilestoneDescription("");
        setSelectedFiles([]);
      }
    }
  }, [open, reference]);

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setType("link");
    setMilestoneColor("#F44336");
    setCustomColor("#F44336");
    setUseCustomColor(false);
    setMilestoneDate("");
    setMilestonePhaseId("");
    setMilestoneDescription("");
    setSelectedFiles([]);
    setColorPickerAnchor(null);
  };

  const handleCustomColorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setUseCustomColor(true);
    setColorPickerAnchor(event.currentTarget as HTMLButtonElement);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setMilestoneColor(color);
  };

  const handleColorSelect = (color: string) => {
    setMilestoneColor(color);
    setUseCustomColor(false);
  };

  return {
    type,
    setType,
    title,
    setTitle,
    url,
    setUrl,
    description,
    setDescription,
    milestoneColor,
    setMilestoneColor,
    milestoneDate,
    setMilestoneDate,
    milestonePhaseId,
    setMilestonePhaseId,
    milestoneDescription,
    setMilestoneDescription,
    useCustomColor,
    setUseCustomColor,
    customColor,
    setCustomColor,
    colorPickerAnchor,
    setColorPickerAnchor,
    selectedFiles,
    setSelectedFiles,
    resetForm,
    handleCustomColorClick,
    handleCustomColorChange,
    handleColorSelect,
  };
}

