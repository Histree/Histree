import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import { SelectedPerson } from "../models";

interface HistreeState {
  selected?: SelectedPerson;
  searchTerm?: string;
}

const initialState: HistreeState = {
  selected: undefined,
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
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

export const { setSelected, setSearchTerm } = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});
