import { Stack } from "@mui/material";
import { TypeSelector } from "./TypeSelector";
import { TitleField } from "./TitleField";
import { UrlField } from "./UrlField";
import { DescriptionField } from "./DescriptionField";
import { FileUploadField } from "./FileUploadField";
import { MilestoneColorSelector } from "./MilestoneColorSelector";
import { MilestoneDatePhaseFields } from "./MilestoneDatePhaseFields";
import { MilestoneDescriptionField } from "./MilestoneDescriptionField";
import type { PlanReferenceType, PlanPhase, PlanReferenceFile } from "../../../../../types";

export type ReferenceFormContentProps = {
  readonly type: PlanReferenceType;
  readonly title: string;
  readonly url: string;
  readonly description: string;
  readonly milestoneColor: string;
  readonly milestoneDate: string;
  readonly milestonePhaseId: string;
  readonly milestoneDescription: string;
  readonly useCustomColor: boolean;
  readonly customColor: string;
  readonly colorPickerAnchor: HTMLButtonElement | null;
  readonly selectedFiles: PlanReferenceFile[];
  readonly phases: PlanPhase[];
  readonly startDate?: string;
  readonly endDate?: string;
  readonly urlError: string;
  readonly dateError: string;
  readonly getTypeColor: (type: PlanReferenceType) => string;
  readonly onTypeChange: (type: PlanReferenceType) => void;
  readonly onTitleChange: (value: string) => void;
  readonly onUrlChange: (value: string) => void;
  readonly onDescriptionChange: (value: string) => void;
  readonly onMilestoneColorSelect: (color: string) => void;
  readonly onCustomColorClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  readonly onColorPickerClose: () => void;
  readonly onCustomColorChange: (color: string) => void;
  readonly onMilestoneDateChange: (date: string) => void;
  readonly onMilestonePhaseChange: (phaseId: string) => void;
  readonly onMilestoneDescriptionChange: (value: string) => void;
  readonly onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onFileRemove: (fileId: string) => void;
  readonly formatFileSize: (bytes: number) => string;
};

export function ReferenceFormContent({
  type,
  title,
  url,
  description,
  milestoneColor,
  milestoneDate,
  milestonePhaseId,
  milestoneDescription,
  useCustomColor,
  customColor,
  colorPickerAnchor,
  selectedFiles,
  phases,
  startDate,
  endDate,
  urlError,
  dateError,
  getTypeColor,
  onTypeChange,
  onTitleChange,
  onUrlChange,
  onDescriptionChange,
  onMilestoneColorSelect,
  onCustomColorClick,
  onColorPickerClose,
  onCustomColorChange,
  onMilestoneDateChange,
  onMilestonePhaseChange,
  onMilestoneDescriptionChange,
  onFileSelect,
  onFileRemove,
  formatFileSize,
}: ReferenceFormContentProps) {
  return (
    <Stack spacing={type === "milestone" ? 3 : 2.5}>
      <TypeSelector
        type={type}
        onChange={onTypeChange}
        getTypeColor={getTypeColor}
      />

      <TitleField value={title} onChange={onTitleChange} />

      {type === "link" && (
        <UrlField value={url} onChange={onUrlChange} error={urlError} />
      )}

      {type === "document" && (
        <FileUploadField
          files={selectedFiles}
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
          formatFileSize={formatFileSize}
        />
      )}

      {type === "milestone" && (
        <>
          <MilestoneColorSelector
            milestoneColor={milestoneColor}
            useCustomColor={useCustomColor}
            customColor={customColor}
            colorPickerAnchor={colorPickerAnchor}
            onColorSelect={onMilestoneColorSelect}
            onCustomColorClick={onCustomColorClick}
            onColorPickerClose={onColorPickerClose}
            onCustomColorChange={onCustomColorChange}
          />

          <MilestoneDatePhaseFields
            milestoneDate={milestoneDate}
            milestonePhaseId={milestonePhaseId}
            phases={phases}
            startDate={startDate}
            endDate={endDate}
            dateError={dateError}
            onDateChange={onMilestoneDateChange}
            onPhaseChange={onMilestonePhaseChange}
          />

          <MilestoneDescriptionField
            value={milestoneDescription}
            onChange={onMilestoneDescriptionChange}
          />
        </>
      )}

      {type !== "milestone" && (
        <DescriptionField
          type={type}
          value={description}
          onChange={onDescriptionChange}
        />
      )}
    </Stack>
  );
}

