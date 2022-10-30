import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import { SelectedPerson } from "../models";

interface HistreeState {
  selected: SelectedPerson | undefined;
}

const initialState: HistreeState = {
  selected: undefined,
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<SelectedPerson | undefined>) => {
      state.selected = action.payload;
    },
  },
});

export const getSelected = createSelector(
  (state: HistreeState) => {
    return state.selected;
  },
  (x) => x
);

export const { setSelected } = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});
