import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  alpha,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  Link as LinkIcon,
  Description as DocumentIcon,
  Note as NoteIcon,
  Comment as CommentIcon,
  AttachFile as FileIcon,
  Flag as MilestoneIcon,
} from "@mui/icons-material";
import type { PlanReference, PlanReferenceType } from "../../../types";

interface ReferenceEditDialogProps {
  open: boolean;
  reference: PlanReference | null;
  isCreating: boolean;
  onClose: () => void;
  onSave: (reference: PlanReference) => void;
}

export function ReferenceEditDialog({
  open,
  reference,
  isCreating,
  onClose,
  onSave,
}: ReferenceEditDialogProps) {
  const theme = useTheme();
  const [type, setType] = useState<PlanReferenceType>("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      if (reference) {
        setType(reference.type);
        setTitle(reference.title);
        setUrl(reference.url || "");
        setDescription(reference.description || "");
      } else {
        setType("link");
        setTitle("");
        setUrl("");
        setDescription("");
      }
    }
  }, [open, reference]);

  const handleSave = () => {
    if (!title.trim()) return;

    const now = new Date().toISOString();
    const referenceToSave: PlanReference = {
      id: reference?.id || `ref-${Date.now()}`,
      type,
      title: title.trim(),
      url:
        (type === "link" || type === "document") && url.trim()
          ? url.trim()
          : undefined,
      description: description.trim() || undefined,
      createdAt: reference?.createdAt || now,
      updatedAt: now,
    };

    onSave(referenceToSave);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setType("link");
    onClose();
  };

  const getTypeIcon = (refType: PlanReferenceType) => {
    switch (refType) {
      case "link":
        return <LinkIcon sx={{ fontSize: 20 }} />;
      case "document":
        return <DocumentIcon sx={{ fontSize: 20 }} />;
      case "note":
        return <NoteIcon sx={{ fontSize: 20 }} />;
      case "comment":
        return <CommentIcon sx={{ fontSize: 20 }} />;
      case "file":
        return <FileIcon sx={{ fontSize: 20 }} />;
      case "milestone":
        return <MilestoneIcon sx={{ fontSize: 20 }} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          fontWeight: 600,
          fontSize: "1.125rem",
        }}
      >
        {isCreating ? "Add Reference" : "Edit Reference"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as PlanReferenceType)}
              label="Type"
              startAdornment={
                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                  {getTypeIcon(type)}
                </Box>
              }
            >
              <MenuItem value="link">
                <Stack direction="row" spacing={1} alignItems="center">
                  <LinkIcon sx={{ fontSize: 18 }} />
                  <span>Link</span>
                </Stack>
              </MenuItem>
              <MenuItem value="document">
                <Stack direction="row" spacing={1} alignItems="center">
                  <DocumentIcon sx={{ fontSize: 18 }} />
                  <span>Document</span>
                </Stack>
              </MenuItem>
              <MenuItem value="note">
                <Stack direction="row" spacing={1} alignItems="center">
                  <NoteIcon sx={{ fontSize: 18 }} />
                  <span>Note</span>
                </Stack>
              </MenuItem>
              <MenuItem value="comment">
                <Stack direction="row" spacing={1} alignItems="center">
                  <CommentIcon sx={{ fontSize: 18 }} />
                  <span>Comment</span>
                </Stack>
              </MenuItem>
              <MenuItem value="file">
                <Stack direction="row" spacing={1} alignItems="center">
                  <FileIcon sx={{ fontSize: 18 }} />
                  <span>File</span>
                </Stack>
              </MenuItem>
              <MenuItem value="milestone">
                <Stack direction="row" spacing={1} alignItems="center">
                  <MilestoneIcon sx={{ fontSize: 18 }} />
                  <span>Milestone</span>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter reference title"
            variant="outlined"
            size="small"
          />

          {(type === "link" || type === "document" || type === "file") && (
            <TextField
              label={
                type === "link"
                  ? "URL"
                  : type === "file"
                  ? "File URL"
                  : "Document URL"
              }
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                type === "link"
                  ? "https://example.com"
                  : type === "file"
                  ? "https://example.com/file.pdf"
                  : "https://docs.example.com/file.pdf"
              }
              variant="outlined"
              size="small"
              helperText={
                type === "link"
                  ? "Enter the web link URL"
                  : type === "file"
                  ? "Enter the file URL or file path"
                  : "Enter the document URL or file path"
              }
            />
          )}

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              type === "note"
                ? "Enter your note or observation..."
                : "Optional description or notes..."
            }
            variant="outlined"
            size="small"
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Button onClick={handleClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!title.trim()}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {isCreating ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
