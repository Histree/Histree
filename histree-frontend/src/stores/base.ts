import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import { RenderContent, Selected } from "../models";
import {
  fetchSearchResults,
  fetchSearchSuggestions,
  ServiceStatus,
} from "../services";

interface HistreeState {
  renderContent: ServiceStatus<RenderContent | undefined>;
  selected?: Selected;
  searchTerm?: string;
  searchSuggestions: Record<string, string>;
  depth: number;
}

const initialState: HistreeState = {
  selected: undefined,
  renderContent: { status: "Initial" },
  searchSuggestions: {},
  depth: 0,
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<Selected | undefined>) => {
      state.selected = action.payload;
    },
    setRenderContent: (
      state,
      action: PayloadAction<ServiceStatus<RenderContent | undefined>>
    ) => {
      state.renderContent = action.payload;
    },
    setDepth: (state, action: PayloadAction<number>) => {
      state.depth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
      state.searchSuggestions = action.payload;
    });
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.renderContent = action.payload;
    });
  },
});

export const getSearchSuggestions = createSelector(
  (state: HistreeState) => {
    return state.searchSuggestions;
  },
  (x) => Object.values(x)
);

export const getRenderContent = createSelector(
  (state: HistreeState) => {
    return state.renderContent;
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

export const { setSelected, setDepth, setRenderContent } = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});

export type AppDispatch = typeof store.dispatch;
