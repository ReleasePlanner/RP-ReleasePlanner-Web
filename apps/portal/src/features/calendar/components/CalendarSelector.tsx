/**
 * CalendarSelector Component
 *
 * Dropdown for selecting which calendar to manage
 * First selects a country, then shows calendars for that country
 */

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import { useCountries } from "@/api/hooks/useCountries";
import type { Calendar } from "../types";

interface CalendarSelectorProps {
  calendars: Calendar[];
  selectedCalendarId: string | undefined;
  onSelectCalendar: (calendarId: string) => void;
  selectedCountryId?: string;
  onSelectCountry?: (countryId: string | undefined) => void;
}

export function CalendarSelector({
  calendars,
  selectedCalendarId,
  onSelectCalendar,
  selectedCountryId,
  onSelectCountry,
}: CalendarSelectorProps) {
  const theme = useTheme();
  const { data: countries = [], isLoading: countriesLoading, error: countriesError } = useCountries();
  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);

  // Filter calendars by selected country
  const filteredCalendars = selectedCountryId
    ? calendars.filter((c) => c.country?.id === selectedCountryId)
    : calendars;

  // Get selected country
  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Header */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: "1.125rem" }}>
          Select Calendar
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
          {filteredCalendars.length} calendar{filteredCalendars.length !== 1 ? "s" : ""}{" "}
          {selectedCountry ? `for ${selectedCountry.name}` : "available"}
        </Typography>
      </Box>

      {/* Country Selector */}
      <FormControl fullWidth sx={{ maxWidth: 400 }}>
        <InputLabel>Country</InputLabel>
        <Select
          value={selectedCountryId || ""}
          label="Country"
          onChange={(e) => {
            const countryId = e.target.value || undefined;
            onSelectCountry?.(countryId);
            // Clear selected calendar when country changes to allow user to select a new one
            onSelectCalendar("");
          }}
          disabled={countriesLoading}
          renderValue={(value) => {
            if (!value) return "Select a country";
            const country = countries.find((c) => c.id === value);
            return country ? `${country.name} (${country.code})` : "";
          }}
          sx={{
            borderRadius: 1.5,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.divider, 0.3),
            },
          }}
        >
          {countriesLoading ? (
            <MenuItem disabled value="">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Loading countries...</Typography>
              </Box>
            </MenuItem>
          ) : countriesError ? (
            <MenuItem disabled value="">
              <Typography variant="body2" color="error">
                Error loading countries
              </Typography>
            </MenuItem>
          ) : countries.length === 0 ? (
            <MenuItem disabled value="">
              <Typography variant="body2" color="text.secondary">
                No countries available
              </Typography>
            </MenuItem>
          ) : (
            countries.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                  <Typography variant="body2">{country.name}</Typography>
                  <Chip
                    label={country.code}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      px: 0.5,
                    }}
                  />
                  {country.region && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: "auto", fontSize: "0.75rem" }}
                    >
                      {country.region}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {/* Calendar Dropdown - Show only when a country is selected */}
      {selectedCountryId ? (
        <FormControl fullWidth sx={{ maxWidth: 400 }}>
          <InputLabel>Calendar</InputLabel>
          <Select
            value={selectedCalendarId || ""}
            label="Calendar"
            onChange={(e) => onSelectCalendar(e.target.value)}
            disabled={filteredCalendars.length === 0}
            renderValue={(value) => {
              const calendar = filteredCalendars.find((c) => c.id === value);
              if (!calendar) return "";
              return `${calendar.name}${calendar.country ? ` (${calendar.country.code})` : ""}`;
            }}
            sx={{
              borderRadius: 1.5,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.divider, 0.3),
              },
            }}
          >
            {filteredCalendars.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  No calendars available for this country. Create one to get started.
                </Typography>
              </MenuItem>
            ) : (
              filteredCalendars.map((calendar) => (
                <MenuItem key={calendar.id} value={calendar.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {calendar.name}
                    </Typography>
                    {calendar.country && (
                      <Chip
                        label={calendar.country.code}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          px: 0.5,
                        }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: "auto", fontSize: "0.75rem" }}
                    >
                      ({calendar.days.length} day{calendar.days.length !== 1 ? "s" : ""})
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      ) : (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.info.main, 0.08),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Please select a country to view calendars
          </Typography>
        </Box>
      )}

      {/* Calendar Info */}
      {selectedCalendar && (
        <Box
          sx={{
            p: 2.5,
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "0.9375rem" }}>
              {selectedCalendar.name}
            </Typography>
            {selectedCalendar.country && (
              <Chip
                label={`${selectedCalendar.country.name} (${selectedCalendar.country.code})`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                }}
              />
            )}
          </Box>
          {selectedCalendar.description && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              {selectedCalendar.description}
            </Typography>
          )}
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            Total days: {selectedCalendar.days.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
