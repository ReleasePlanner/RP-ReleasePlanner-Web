import { Box, Typography, Button, Stack, IconButton, useTheme, alpha } from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import type { PlanReferenceFile } from "../../../../../types";

export type FileUploadFieldProps = {
  readonly files: PlanReferenceFile[];
  readonly onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onFileRemove: (fileId: string) => void;
  readonly formatFileSize: (bytes: number) => string;
};

export function FileUploadField({
  files,
  onFileSelect,
  onFileRemove,
  formatFileSize,
}: FileUploadFieldProps) {
  const theme = useTheme();

  const handleDownload = (file: PlanReferenceFile) => {
    if (file.url) {
      const fileUrl = file.url.startsWith("http")
        ? file.url
        : `${globalThis.location.origin}${file.url}`;
      globalThis.open(fileUrl, "_blank");
    }
  };

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 1,
          fontWeight: 500,
          fontSize: "0.75rem",
          color: theme.palette.text.secondary,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Archivos
      </Typography>
      <Box
        sx={{
          border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
          borderRadius: 2,
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.5),
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        <input
          accept="*/*"
          style={{ display: "none" }}
          id="file-upload-input"
          multiple
          type="file"
          onChange={onFileSelect}
        />
        <label htmlFor="file-upload-input">
          <Button
            component="span"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: 2,
              py: 1.25,
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            Select files
          </Button>
        </label>
        {files.length > 0 && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            {files.map((file) => (
              <Box
                key={file.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  flex={1}
                  sx={{ minWidth: 0 }}
                >
                  <AttachFileIcon
                    sx={{
                      fontSize: 20,
                      color: theme.palette.primary.main,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.6875rem",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {formatFileSize(file.size)} • {file.type || "Tipo desconocido"}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  {file.url && (
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(file)}
                      sx={{
                        color: theme.palette.primary.main,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <DownloadIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => onFileRemove(file.id)}
                    sx={{
                      color: theme.palette.error.main,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

