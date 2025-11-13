/**
 * Calendars slice - State management for calendars
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Calendar } from "@/features/calendar/types";
import { MOCK_CALENDARS } from "@/features/calendar/constants";

export interface CalendarsState {
  calendars: Calendar[];
}

const initialState: CalendarsState = {
  calendars: MOCK_CALENDARS,
};

const calendarsSlice = createSlice({
  name: "calendars",
  initialState,
  reducers: {
    addCalendar(state, action: PayloadAction<Calendar>) {
      state.calendars.push(action.payload);
    },
    updateCalendar(state, action: PayloadAction<Calendar>) {
      const index = state.calendars.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.calendars[index] = action.payload;
      }
    },
    deleteCalendar(state, action: PayloadAction<string>) {
      state.calendars = state.calendars.filter((c) => c.id !== action.payload);
    },
    setCalendars(state, action: PayloadAction<Calendar[]>) {
      state.calendars = action.payload;
    },
  },
});

export const { addCalendar, updateCalendar, deleteCalendar, setCalendars } =
  calendarsSlice.actions;

export const calendarsReducer = calendarsSlice.reducer;
