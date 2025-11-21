import { useState } from "react";
import type { PlanReferenceFile } from "../../../../../types";

export function useFileOperations() {
  const [selectedFiles, setSelectedFiles] = useState<PlanReferenceFile[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: PlanReferenceFile[] = Array.from(files).map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset input to allow selecting the same file again
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleFileRemove = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return {
    selectedFiles,
    setSelectedFiles,
    handleFileSelect,
    handleFileRemove,
    formatFileSize,
  };
}

