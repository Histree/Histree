import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import {
  AutoCompleteData,
  NodeLookup,
  RenderContent,
  Selected,
} from "../models";
import {
  fetchSearchResults,
  fetchSearchSuggestions,
  fetchSelectedExpansion,
  ServiceStatus,
} from "../services";

interface HistreeState {
  renderContent: ServiceStatus<RenderContent | undefined>;
  selected?: Selected;
  searchTerm?: string;
  searchSuggestions: Record<string, AutoCompleteData>;
  nodeLookup: NodeLookup;
}

const initialState: HistreeState = {
  selected: undefined,
  renderContent: { status: "Initial" },
  searchSuggestions: {},
  nodeLookup: {},
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
    setNodeLookup: (state, action: PayloadAction<NodeLookup>) => {
      state.nodeLookup = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
      state.searchSuggestions = action.payload;
    });

    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.renderContent = action.payload;
      const lookup: NodeLookup = {};

      if (action.payload.status === "Success") {
        state.renderContent.content!.flowers.forEach((f) => {
          lookup[f.id] = f;
          lookup[f.id].visible = f.id === action.payload.content!.searchedQid;
          lookup[f.id].searched = f.id === action.payload.content!.searchedQid;
        });
      }
      state.nodeLookup = lookup;
    });

    builder.addCase(fetchSelectedExpansion.fulfilled, (state, action) => {
      const response = action.payload;
      const renderContent = { ...state.renderContent };
      const lookup = { ...state.nodeLookup };

      if (response.status === "Success") {
        const { branches, flowers, direction, searchedQid } = response.content!;

        flowers.forEach((f) => {
          lookup[f.id] = f;
          lookup[f.id].visible = f.id === searchedQid;
          lookup[f.id].searched = f.id === searchedQid;
        });

        const render = renderContent.content!;
        flowers.forEach((x) => {
          if (!render.flowers.includes(x)) {
            render.flowers.push(x);
          }
        });

        Object.keys(branches).forEach((b) => {
          render.branches[b] = branches[b];
        });

        if (direction === "up") {
          Object.keys(render.branches).forEach((parentId) => {
            if (render.branches[parentId].includes(searchedQid)) {
              lookup[parentId].visible = true;
            }
          });
        } else {
          render.branches[searchedQid].forEach((childId) => {
            lookup[childId].visible = true;
          });
        }
        state.nodeLookup = lookup;
      }

      state.renderContent = renderContent;
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

export const getNodeLookup = createSelector(
  (state: HistreeState) => {
    return state.nodeLookup;
  },
  (x) => x
);

export const {
  setSelected,
  setNodeLookup,
  setRenderContent,
  resetSearch,
  setResultServiceState,
} = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});

export type AppDispatch = typeof store.dispatch;
