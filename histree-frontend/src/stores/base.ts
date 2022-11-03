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
  searchSuggestions: string[];
  depth: number;
}

const initialState: HistreeState = {
  selected: undefined,
  searchSuggestions: [],
  depth: 0,
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setSearchSuggestions: (state, action: PayloadAction<string[]>) => {
      state.searchSuggestions = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelected: (state, action: PayloadAction<SelectedPerson | undefined>) => {
      state.selected = action.payload;
    },
    setDepth: (state, action: PayloadAction<number>) => {
      state.depth = action.payload;
    },
  },
});

export const getSearchSuggestions = createSelector(
  (state: HistreeState) => {
    return state.searchSuggestions;
  },
  (x) => x
);

export const getSearchTerm = createSelector(
  (state: HistreeState) => {
    return state.searchTerm;
  },
  (x) => x
);

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

export const { setSelected, setDepth, setSearchTerm, setSearchSuggestions } =
  histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});
