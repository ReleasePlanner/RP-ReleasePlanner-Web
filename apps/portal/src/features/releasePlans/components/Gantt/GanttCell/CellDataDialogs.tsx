import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Divider,
  IconButton,
  Chip,
  Link as MuiLink,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  AttachFile as FileIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import type {
  GanttCellComment,
  GanttCellFile,
  GanttCellLink,
} from "../../../types";

type CellCommentsDialogProps = {
  open: boolean;
  onClose: () => void;
  comments: GanttCellComment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
};

export function CellCommentsDialog({
  open,
  onClose,
  comments,
  onAddComment,
  onDeleteComment,
}: CellCommentsDialogProps) {
  const [newComment, setNewComment] = useState("");

  const handleAdd = useCallback(() => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  }, [newComment, onAddComment]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
        <CommentIcon sx={{ mr: 1, fontSize: 20 }} />
        <span>Comentarios</span>
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{ ml: "auto", size: "small" }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {/* Add new comment */}
          <TextField
            multiline
            rows={3}
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            size="small"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!newComment.trim()}
            size="small"
            sx={{ alignSelf: "flex-end", textTransform: "none" }}
          >
            Agregar Comentario
          </Button>

          <Divider />

          {/* Comments list */}
          {comments.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2 }}
            >
              No hay comentarios aún
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {comments.map((comment) => (
                <Stack
                  key={comment.id}
                  spacing={0.5}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="caption" fontWeight={600}>
                      {comment.author}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteComment(comment.id)}
                      sx={{ width: 24, height: 24 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2">{comment.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type CellFilesDialogProps = {
  open: boolean;
  onClose: () => void;
  files: GanttCellFile[];
  onAddFile: (file: { name: string; url: string }) => void;
  onDeleteFile: (fileId: string) => void;
};

export function CellFilesDialog({
  open,
  onClose,
  files,
  onAddFile,
  onDeleteFile,
}: CellFilesDialogProps) {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleAdd = useCallback(() => {
    if (fileName.trim() && fileUrl.trim()) {
      onAddFile({ name: fileName.trim(), url: fileUrl.trim() });
      setFileName("");
      setFileUrl("");
    }
  }, [fileName, fileUrl, onAddFile]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
        <FileIcon sx={{ mr: 1, fontSize: 20 }} />
        <span>Archivos</span>
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{ ml: "auto" }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {/* Add new file */}
          <TextField
            label="Nombre del archivo"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="URL del archivo"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            size="small"
            fullWidth
            placeholder="https://..."
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!fileName.trim() || !fileUrl.trim()}
            size="small"
            sx={{ alignSelf: "flex-end", textTransform: "none" }}
          >
            Agregar Archivo
          </Button>

          <Divider />

          {/* Files list */}
          {files.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2 }}
            >
              No hay archivos aún
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {files.map((file) => (
                <Stack
                  key={file.id}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <FileIcon fontSize="small" />
                  <Stack flex={1} spacing={0.25}>
                    <MuiLink
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {file.name}
                    </MuiLink>
                    <Typography variant="caption" color="text.secondary">
                      {file.size
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : "Sin tamaño"}
                    </Typography>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteFile(file.id)}
                    sx={{ width: 24, height: 24 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type CellLinksDialogProps = {
  open: boolean;
  onClose: () => void;
  links: GanttCellLink[];
  onAddLink: (link: { title: string; url: string; description?: string }) => void;
  onDeleteLink: (linkId: string) => void;
};

export function CellLinksDialog({
  open,
  onClose,
  links,
  onAddLink,
  onDeleteLink,
}: CellLinksDialogProps) {
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");

  const handleAdd = useCallback(() => {
    if (linkTitle.trim() && linkUrl.trim()) {
      onAddLink({
        title: linkTitle.trim(),
        url: linkUrl.trim(),
        description: linkDescription.trim() || undefined,
      });
      setLinkTitle("");
      setLinkUrl("");
      setLinkDescription("");
    }
  }, [linkTitle, linkUrl, linkDescription, onAddLink]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
        <LinkIcon sx={{ mr: 1, fontSize: 20 }} />
        <span>Enlaces</span>
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{ ml: "auto" }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {/* Add new link */}
          <TextField
            label="Título del enlace"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            size="small"
            fullWidth
            placeholder="https://..."
          />
          <TextField
            label="Descripción (opcional)"
            value={linkDescription}
            onChange={(e) => setLinkDescription(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={2}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!linkTitle.trim() || !linkUrl.trim()}
            size="small"
            sx={{ alignSelf: "flex-end", textTransform: "none" }}
          >
            Agregar Enlace
          </Button>

          <Divider />

          {/* Links list */}
          {links.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2 }}
            >
              No hay enlaces aún
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {links.map((link) => (
                <Stack
                  key={link.id}
                  spacing={0.5}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <MuiLink
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      fontWeight={600}
                    >
                      {link.title}
                    </MuiLink>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteLink(link.id)}
                      sx={{ width: 24, height: 24 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  {link.description && (
                    <Typography variant="body2" color="text.secondary">
                      {link.description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

