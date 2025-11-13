import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BasePhase } from "./types";

export interface BasePhasesState {
  phases: BasePhase[];
}

const initialState: BasePhasesState = {
  phases: [
    {
      id: "base-1",
      name: "Análisis",
      color: "#1976D2",
      category: "Requerimientos",
    },
    {
      id: "base-2",
      name: "Diseño",
      color: "#388E3C",
      category: "Arquitectura",
    },
    {
      id: "base-3",
      name: "Desarrollo",
      color: "#FBC02D",
      category: "Construcción",
    },
    {
      id: "base-4",
      name: "Pruebas",
      color: "#D32F2F",
      category: "Calidad",
    },
    {
      id: "base-5",
      name: "Implementación",
      color: "#7B1FA2",
      category: "Despliegue",
    },
    {
      id: "base-6",
      name: "Mantenimiento",
      color: "#455A64",
      category: "Soporte",
    },
  ],
};

const basePhasesSlice = createSlice({
  name: "basePhases",
  initialState,
  reducers: {
    setBasePhases(state, action: PayloadAction<BasePhase[]>) {
      state.phases = action.payload;
    },
    addBasePhase(state, action: PayloadAction<BasePhase>) {
      state.phases.push(action.payload);
    },
    updateBasePhase(
      state,
      action: PayloadAction<{ id: string; changes: Partial<BasePhase> }>
    ) {
      const idx = state.phases.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) Object.assign(state.phases[idx], action.payload.changes);
    },
    removeBasePhase(state, action: PayloadAction<string>) {
      state.phases = state.phases.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setBasePhases, addBasePhase, updateBasePhase, removeBasePhase } =
  basePhasesSlice.actions;
export const basePhasesReducer = basePhasesSlice.reducer;
