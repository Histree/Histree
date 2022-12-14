import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import {
  CompareNodes,
  EdgeChildInfo,
  EdgeInfo,
  FilterInfo,
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
  DataFail,
  DataSuccess,
} from "../services";
import { uniq } from "lodash";
import { Viewport } from "reactflow";
import { matchesFilter } from "../utils/filter";

interface HistreeState {
  renderMode: RenderMode;
  renderContent: ServiceStatus<RenderContent>;
  selected?: Selected;
  searchSuggestions: SearchBarInfo;
  nodeLookup: NodeLookup;
  edgeInfo: EdgeInfo;
  compareNodes: CompareNodes;
  relationship: ServiceStatus<RelationshipInfo | undefined>;
  currViewport: Viewport;
  filterInfo: FilterInfo;
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
  currViewport: { x: 0, y: 0, zoom: 2 },
  filterInfo: {
    filtered: false,
    bornBetween: { startDate: "", endDate: "" },
    diedBetween: { startDate: "", endDate: "" },
    searchTerm: undefined,
    marriageStatus: "Off",
  },
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setNodeOnScreen: (
      state,
      action: PayloadAction<{ id: NodeId; onScreen: boolean }>
    ) => {
      if (!state.nodeLookup[action.payload.id].visible) {
        state.nodeLookup[action.payload.id].visible = action.payload.onScreen;
      }
    },
    setRenderMode: (state, action: PayloadAction<RenderMode>) => {
      state.compareNodes = {};
      state.edgeInfo = {};
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
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchSuggestions.searchTerm = action.payload;
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
      action: PayloadAction<ServiceStatus<RenderContent>>
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
    setFilterInfo: (state, action: PayloadAction<FilterInfo>) => {
      state.filterInfo = action.payload;

      Object.keys(state.nodeLookup).forEach((id) => {
        state.nodeLookup[id].matchedFilter = matchesFilter(
          state.nodeLookup[id],
          state.filterInfo
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
      state.searchSuggestions.autocompleteData = action.payload;
    });

    builder.addCase(
      fetchSearchResults.rejected,
      (state: HistreeState, action) => {
        const errorContent: DataFail<RenderContent> = {
          status: "Failure",
          error: action.error.message as string,
        };
        state.renderContent = errorContent;
      }
    );
    builder.addCase(
      fetchSearchResults.fulfilled,
      (
        state,
        action: PayloadAction<
          DataSuccess<RenderContent> | DataFail<RenderContent>
        >
      ) => {
        const lookup: NodeLookup = {};
        const successData = action.payload as DataSuccess<RenderContent>;
        state.renderContent = successData;
        state.renderContent.content.flowers.forEach((f) => {
          lookup[f.id] = f;
          lookup[f.id].visible = f.id === successData.content.searchedQid;
          lookup[f.id].searched = f.id === successData.content.searchedQid;
          lookup[f.id].matchedFilter = true;
        });
        state.renderContent.content.branches = successData.content.branches;
        state.nodeLookup = lookup;
        state.searchSuggestions.searchTerm = successData.content.searchedName;
      }
    );
    builder.addCase(
      fetchSelectedExpansion.rejected,
      (state: HistreeState, action) => {
        state.renderContent = {
          ...state.renderContent,
          status: "Failure",
          error: action.error.message as string,
        };
      }
    );
    builder.addCase(
      fetchSelectedExpansion.fulfilled,
      (
        state: HistreeState,
        action: PayloadAction<
          DataSuccess<RenderContent> | DataFail<RenderContent>
        >
      ) => {
        const response = action.payload as DataSuccess<RenderContent>;
        const lookup = { ...state.nodeLookup };
        const { branches, flowers, searchedQid, searchedName } =
          response.content;
        const stateContent = state.renderContent as DataSuccess<RenderContent>;
        stateContent.content.searchedName = searchedName;
        stateContent.content.searchedQid = searchedQid;
        stateContent.status = "Success";
        // state.renderContent = response;
        flowers.forEach((f) => {
          if (lookup[f.id] === undefined) {
            lookup[f.id] = f;
            lookup[f.id].visible = true;
            lookup[f.id].searched = f.id === searchedQid;
            lookup[f.id].matchedFilter = matchesFilter(
              lookup[f.id],
              state.filterInfo
            );
          }
          if (!stateContent.content.flowers.includes(f)) {
            stateContent.content.flowers.push(f);
          }
        });

        Object.keys(branches).forEach((b) => {
          const individualBranch = stateContent.content.branches[b];
          const newBranch =
            individualBranch !== undefined
              ? uniq([...individualBranch, ...branches[b]])
              : branches[b];
          stateContent.content.branches[b] = newBranch;
        });
        state.nodeLookup = lookup;
        state.renderContent = stateContent;
      }
    );

    builder.addCase(fetchRelationship.rejected, (state: HistreeState) => {
      state.renderContent.status = "Failure";
    });
    builder.addCase(fetchRelationship.fulfilled, (state, action) => {
      state.relationship = action.payload;
      if (action.payload.status === "Success") {
        const content = action.payload.content;
        state.edgeInfo = {};
        for (let i = 0; i < content.path.length - 1; i++) {
          const newTip: EdgeChildInfo = {};
          newTip[content.path[i + 1]] = {
            stroke: "orange",
            strokeWidth: "0.3em",
          };
          state.edgeInfo[content.path[i]] = newTip;
        }
      }
    });
  },
});

export const getCurrentViewport = createSelector(
  (state: HistreeState) => {
    return state.currViewport;
  },
  (x) => x
);
export const getSearchSuggestions = createSelector(
  (state: HistreeState) => {
    return state.searchSuggestions;
  },
  (x) => ({
    searchTerm: x.searchTerm,
    searchSuggestions: Object.fromEntries(
      Object.values(x.autocompleteData).map((value) => [value.id, value])
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
export const getFilterInfo = createSelector(
  (state: HistreeState) => {
    return state.filterInfo;
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
  setNodeOnScreen,
  setSearchValue,
  setFilterInfo,
} = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});

export type AppDispatch = typeof store.dispatch;
