import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import { SelectedPerson } from "../models";

interface HistreeState {
  selected: SelectedPerson | undefined;
  depth: number;
}

const initialState: HistreeState = {
  selected: undefined,
  depth: 0,
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<SelectedPerson | undefined>) => {
      state.selected = action.payload;
    },
    setDepth: (state, action: PayloadAction<number>) => {
      state.depth = action.payload;
    },
  },
});

export const getSelected = createSelector(
  (state: HistreeState) => {
    return state.selected;
  },
  (x) => x
);

export const getDepth = createSelector(
  (state: HistreeState) => {
    return state.depth;
  },
  (x) => x
);

export const { setSelected, setDepth } = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});
