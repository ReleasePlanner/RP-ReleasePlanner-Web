/**
 * IT Owner Card Component
 *
 * Displays IT Owner information with edit/delete actions
 */

import { Box, IconButton, Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ElegantCard } from "@/components";
import type { ITOwner } from "@/features/releasePlans/constants/itOwners";

interface ITOwnerCardProps {
  owner: ITOwner;
  onEdit: () => void;
  onDelete: () => void;
}

export function ITOwnerCard({ owner, onEdit, onDelete }: ITOwnerCardProps) {
  return (
    <ElegantCard hover>
      <Box sx={{ p: 2.5 }}>
        {/* Header with actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "text.primary",
                mb: 0.5,
              }}
            >
              {owner.name}
            </Typography>
            {owner.email && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                }}
              >
                {owner.email}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 0.5, ml: 2 }}>
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.lighter",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "error.lighter",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Department */}
        {owner.department && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: "primary.lighter",
              color: "primary.main",
              fontSize: "0.8125rem",
              fontWeight: 500,
            }}
          >
            🏢 {owner.department}
          </Box>
        )}
      </Box>
    </ElegantCard>
  );
}
