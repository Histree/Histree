import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";
import { SelectedPerson } from "../models";

interface HistreeState {
  selected?: SelectedPerson;
}

const initialState: HistreeState = {
  selected: {
    name: "wtf",
  },
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<SelectedPerson | undefined>) => {
      if (action.payload != null) {
        state.selected = action.payload;
      }
    },
  },
});

export const getSelected = (state: HistreeState): SelectedPerson | undefined =>
  state.selected;

export const { setSelected } = histreeState.actions;

export const store = configureStore({
  reducer: {
    histreeState: histreeState.reducer,
  },
});
