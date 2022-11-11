import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import {
  AutoCompleteData,
  RenderContent,
  Selected,
  VisibleContent,
} from "../models";
import {
  fetchSearchResults,
  fetchSearchSuggestions,
  ServiceStatus,
} from "../services";

interface HistreeState {
  renderContent: ServiceStatus<RenderContent | undefined>;
  selected?: Selected;
  searchTerm?: string;
  searchSuggestions: Record<string, AutoCompleteData>;
  visible: VisibleContent;
}

const initialState: HistreeState = {
  selected: undefined,
  renderContent: { status: "Initial" },
  searchSuggestions: {},
  visible: {},
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    resetSearch: (state) => {
      state.searchSuggestions = {};
    },
    setResultServiceState: (
      state,
      action: PayloadAction<ServiceStatus<RenderContent>>
    ) => {
      state.renderContent = action.payload;
    },
    setSelected: (state, action: PayloadAction<Selected | undefined>) => {
      state.selected = action.payload;
    },
    setRenderContent: (
      state,
      action: PayloadAction<ServiceStatus<RenderContent | undefined>>
    ) => {
      state.renderContent = action.payload;
    },
    setVisible: (state, action: PayloadAction<VisibleContent>) => {
      state.visible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
      state.searchSuggestions = action.payload;
    });
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.renderContent = action.payload;
      const vis: VisibleContent = {};
      if (action.payload.status === "Success") {
        vis[action.payload.content!.searchedQid] = true;
      }
      state.visible = vis;
    });
  },
});

export const getSearchSuggestions = createSelector(
  (state: HistreeState) => {
    return state.searchSuggestions;
  },
  (x) =>
    Object.fromEntries(Object.values(x).map((value) => [value.label, value]))
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

export const getVisible = createSelector(
  (state: HistreeState) => {
    return state.visible;
  },
  (x) => x
);

export const {
  setSelected,
  setVisible,
  setRenderContent,
  resetSearch,
  setResultServiceState,
} = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});

export type AppDispatch = typeof store.dispatch;
