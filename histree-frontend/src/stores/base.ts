import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import {
  EdgeInfo,
  ExpandInfo,
  HandleStatus,
  NodeId,
  NodeInfo,
  NodeLookup,
  RelationshipInfo,
  RenderContent,
  RenderMode,
  SearchBarInfo,
  Selected,
} from "../models";
import {
  fetchRelationship,
  fetchSearchResults,
  fetchSearchSuggestions,
  fetchSelectedExpansion,
  ServiceStatus,
} from "../services";
import { uniq } from "lodash";
import { CompareNodes } from "../models/compareInfo";

interface HistreeState {
  renderMode: RenderMode;
  renderContent: ServiceStatus<RenderContent | undefined>;
  selected?: Selected;
  searchTerm?: string;
  searchSuggestions: SearchBarInfo;
  nodeLookup: NodeLookup;
  edgeInfo: EdgeInfo;
  compareNodes: CompareNodes;
  relationship: ServiceStatus<RelationshipInfo | undefined>;
}

const initialState: HistreeState = {
  selected: undefined,
  renderMode: "View",
  renderContent: { status: "Initial" },
  searchSuggestions: { searchTerm: "", autocompleteData: {} },
  nodeLookup: {},
  edgeInfo: {},
  compareNodes: {},
  relationship: { status: "Initial" },
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setRenderMode: (state, action: PayloadAction<RenderMode>) => {
      if (action.payload === "View") {
        state.edgeInfo = {};
        state.compareNodes = {};
      }
      state.renderMode = action.payload;
    },
    setNodeLookupDown: (
      state,
      action: PayloadAction<{ searchedQid: NodeId; status: HandleStatus }>
    ) => {
      state.nodeLookup[action.payload.searchedQid].downExpanded =
        action.payload.status;
    },
    setNodeLookupUp: (
      state,
      action: PayloadAction<{ searchedQid: NodeId; status: HandleStatus }>
    ) => {
      state.nodeLookup[action.payload.searchedQid].upExpanded =
        action.payload.status;
    },
    resetSearch: (state) => {
      state.searchSuggestions.autocompleteData = {};
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
    setComparisonNode: (state, action: PayloadAction<NodeInfo | undefined>) => {
      console.log(state.compareNodes.first?.id);
      console.log(action.payload?.id);
      if (state.compareNodes.first === undefined) {
        if (
          state.compareNodes.second !== undefined &&
          action.payload?.id === state.compareNodes.second.id
        ) {
          state.compareNodes.second = undefined;
        } else {
          state.compareNodes.first = action.payload;
        }
      } else if (state.compareNodes.first.id === action.payload?.id) {
        state.compareNodes.first = undefined;
      } else if (
        state.compareNodes.second &&
        state.compareNodes.second.id === action.payload?.id
      ) {
        state.compareNodes.second = undefined;
      } else {
        state.compareNodes.second = action.payload;
      }
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
    setEdgeInfo: (state, action: PayloadAction<EdgeInfo>) => {
      state.edgeInfo = action.payload;
    },
    setRelationship: (
      state,
      action: PayloadAction<ServiceStatus<RelationshipInfo | undefined>>
    ) => {
      state.relationship = action.payload;
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
        state.renderContent.content?.flowers.forEach((f) => {
          lookup[f.id] = f;
          lookup[f.id].visible = f.id === action.payload.content?.searchedQid;
          lookup[f.id].searched = f.id === action.payload.content?.searchedQid;
        });
      }
      state.nodeLookup = lookup;
    });

    builder.addCase(
      fetchSelectedExpansion.fulfilled,
      (state: HistreeState, action) => {
        const response = action.payload;
        const lookup = { ...state.nodeLookup };
        if (response.status === "Success") {
          const { branches, flowers, direction, searchedQid } =
            response.content as RenderContent & ExpandInfo;

          flowers.forEach((f) => {
            if (lookup[f.id] === undefined) {
              lookup[f.id] = f;
              lookup[f.id].visible = f.id === searchedQid;
              lookup[f.id].searched = f.id === searchedQid;
            }
          });

          flowers.forEach((x) => {
            if (
              state.renderContent.content !== undefined &&
              !state.renderContent.content.flowers.includes(x)
            ) {
              state.renderContent.content.flowers.push(x);
            }
          });

          Object.keys(branches).forEach((b) => {
            const individualBranch = state.renderContent.content?.branches[b];
            const newBranch =
              individualBranch !== undefined
                ? uniq([...individualBranch, ...branches[b]])
                : branches[b];
            if (state.renderContent.content != null) {
              state.renderContent.content.branches[b] = newBranch;
            }
          });

          if (direction === "up") {
            Object.keys(branches).forEach((parentId) => {
              if (branches[parentId].includes(searchedQid)) {
                lookup[parentId].visible = true;
              }
            });
            lookup[searchedQid].upExpanded = "Complete";
          } else {
            if (branches[searchedQid] !== undefined) {
              branches[searchedQid].forEach((childId) => {
                if (lookup[childId] !== undefined) {
                  lookup[childId].visible = true;
                }
              });
            }
            lookup[searchedQid].downExpanded = "Complete";
          }
          state.nodeLookup = lookup;
        }
      }
    );

    builder.addCase(fetchRelationship.fulfilled, (state, action) => {
      state.relationship = action.payload;
    });
  },
});

export const getSearchSuggestions = createSelector(
  (state: HistreeState) => {
    return state.searchSuggestions;
  },
  (x) => ({
    searchTerm: x.searchTerm,
    searchSuggestions: Object.fromEntries(
      Object.values(x.autocompleteData).map((value) => [value.label, value])
    ),
  })
);

export const getRenderMode = createSelector(
  (state: HistreeState) => {
    return state.renderMode;
  },
  (x) => x
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
export const getEdgeInfo = createSelector(
  (state: HistreeState) => {
    return state.edgeInfo;
  },
  (x) => x
);
export const getCompareNodes = createSelector(
  (state: HistreeState) => {
    return state.compareNodes;
  },
  (x) => x
);
export const getRelationship = createSelector(
  (state: HistreeState) => {
    return state.relationship;
  },
  (x) => x
);

export const {
  setSelected,
  setNodeLookup,
  setRenderContent,
  resetSearch,
  setResultServiceState,
  setNodeLookupDown,
  setNodeLookupUp,
  setRenderMode,
  setComparisonNode,
  setEdgeInfo,
  setRelationship,
} = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});

export type AppDispatch = typeof store.dispatch;
