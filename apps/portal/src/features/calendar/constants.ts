/**
 * Calendar Feature Constants
 *
 * Constants for calendars, holidays, and special days
 */

export const DAY_TYPES = [
  { value: "holiday", label: "Holiday" },
  { value: "special", label: "Special Day" },
] as const;

export const CALENDAR_SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
  { value: "type", label: "Type" },
] as const;

export const CALENDAR_FILTER_OPTIONS = [
  { value: "all", label: "All Days" },
  { value: "holiday", label: "Holidays Only" },
  { value: "special", label: "Special Days Only" },
] as const;

/**
 * Mock data for calendars
 */
export const MOCK_CALENDARS = [
  {
    id: "cal-1",
    name: "United States",
    description: "US Federal Holidays and Special Days",
    days: [
      {
        id: "day-1",
        name: "New Year's Day",
        date: "2025-01-01",
        type: "holiday" as const,
        description: "First day of the year",
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
      {
        id: "day-2",
        name: "Martin Luther King Jr. Day",
        date: "2025-01-20",
        type: "holiday" as const,
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
      {
        id: "day-3",
        name: "Presidents' Day",
        date: "2025-02-17",
        type: "holiday" as const,
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
      {
        id: "day-4",
        name: "Memorial Day",
        date: "2025-05-26",
        type: "holiday" as const,
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
      {
        id: "day-5",
        name: "Independence Day",
        date: "2025-07-04",
        type: "holiday" as const,
        description: "US Independence Day",
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
      {
        id: "day-6",
        name: "Company Anniversary",
        date: "2025-03-15",
        type: "special" as const,
        description: "10th company anniversary",
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
    ],
    createdAt: "2024-11-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "cal-2",
    name: "Mexico",
    description: "Mexican Holidays and Special Days",
    days: [
      {
        id: "day-7",
        name: "Año Nuevo",
        date: "2025-01-01",
        type: "holiday" as const,
        description: "New Year's Day",
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
      {
        id: "day-8",
        name: "Día de Muertos",
        date: "2025-11-01",
        type: "special" as const,
        description: "Day of the Dead",
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
      {
        id: "day-9",
        name: "Navidad",
        date: "2025-12-25",
        type: "holiday" as const,
        description: "Christmas",
        recurring: true,
        createdAt: "2024-11-01",
        updatedAt: "2024-11-01",
      },
    ],
    createdAt: "2024-11-01",
    updatedAt: "2024-11-01",
  },
];
