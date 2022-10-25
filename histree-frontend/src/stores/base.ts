import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedPerson } from "../models";

interface HistreeState {
  selected?: SelectedPerson;
}

const initialState: HistreeState = {
  selected: undefined,
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<SelectedPerson>) => {
      state.selected = action.payload;
    },
  },
});

export const getSelected = (state: HistreeState): SelectedPerson | undefined =>
  state.selected;
