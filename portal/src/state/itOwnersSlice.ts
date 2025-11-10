/**
 * IT Owners slice - State management for IT Owners
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ITOwner } from "@/features/releasePlans/constants/itOwners";

export interface ITOwnersState {
  itOwners: ITOwner[];
}

const initialState: ITOwnersState = {
  itOwners: [
    {
      id: "it-owner-1",
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      department: "Platform Engineering",
    },
    {
      id: "it-owner-2",
      name: "Bob Smith",
      email: "bob.smith@company.com",
      department: "Infrastructure",
    },
    {
      id: "it-owner-3",
      name: "Carol Davis",
      email: "carol.davis@company.com",
      department: "DevOps",
    },
    {
      id: "it-owner-4",
      name: "David Wilson",
      email: "david.wilson@company.com",
      department: "Architecture",
    },
    {
      id: "it-owner-5",
      name: "Emma Brown",
      email: "emma.brown@company.com",
      department: "Release Management",
    },
  ],
};

const itOwnersSlice = createSlice({
  name: "itOwners",
  initialState,
  reducers: {
    addITOwner(state, action: PayloadAction<ITOwner>) {
      state.itOwners.push(action.payload);
    },
    updateITOwner(state, action: PayloadAction<ITOwner>) {
      const index = state.itOwners.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.itOwners[index] = action.payload;
      }
    },
    deleteITOwner(state, action: PayloadAction<string>) {
      state.itOwners = state.itOwners.filter((o) => o.id !== action.payload);
    },
    setITOwners(state, action: PayloadAction<ITOwner[]>) {
      state.itOwners = action.payload;
    },
  },
});

export const { addITOwner, updateITOwner, deleteITOwner, setITOwners } =
  itOwnersSlice.actions;

export const itOwnersReducer = itOwnersSlice.reducer;
