import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { releasePlansReducer } from "../features/releasePlans/slice";

type UiState = {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  planLeftPercentByPlanId?: Record<string, number>;
  planExpandedByPlanId?: Record<string, boolean>;
};

const initialUiState: UiState = {
  leftSidebarOpen: false,
  rightSidebarOpen: false,
  planLeftPercentByPlanId: {},
  planExpandedByPlanId: {},
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    setLeftSidebarOpen(state, action: PayloadAction<boolean>) {
      state.leftSidebarOpen = action.payload;
    },
    setRightSidebarOpen(state, action: PayloadAction<boolean>) {
      state.rightSidebarOpen = action.payload;
    },
    toggleLeftSidebar(state) {
      state.leftSidebarOpen = !state.leftSidebarOpen;
    },
    toggleRightSidebar(state) {
      state.rightSidebarOpen = !state.rightSidebarOpen;
    },
    setPlanLeftPercent(state, action: PayloadAction<{ planId: string; percent: number }>) {
      if (!state.planLeftPercentByPlanId) state.planLeftPercentByPlanId = {} as Record<string, number>;
      state.planLeftPercentByPlanId[action.payload.planId] = action.payload.percent;
    },
    setPlanExpanded(state, action: PayloadAction<{ planId: string; expanded: boolean }>) {
      if (!state.planExpandedByPlanId) state.planExpandedByPlanId = {} as Record<string, boolean>;
      state.planExpandedByPlanId[action.payload.planId] = action.payload.expanded;
    },
  },
});

export const {
  setLeftSidebarOpen,
  setRightSidebarOpen,
  toggleLeftSidebar,
  toggleRightSidebar,
  setPlanLeftPercent,
  setPlanExpanded,
} = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    releasePlans: releasePlansReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
