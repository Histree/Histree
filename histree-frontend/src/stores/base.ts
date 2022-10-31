import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import { RenderContent, SelectedPerson } from "../models";
import { ServiceStatus } from "../services";

interface HistreeState {
  selected: SelectedPerson | undefined;
  renderContent: ServiceStatus<RenderContent | undefined>;
}

const initialState: HistreeState = {
  selected: undefined,
  renderContent: { status: "Initial" },
};

export const histreeState = createSlice({
  name: "histreeState",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<SelectedPerson | undefined>) => {
      state.selected = action.payload;
    },
    setRenderContent: (
      state,
      action: PayloadAction<ServiceStatus<RenderContent | undefined>>
    ) => {
      state.renderContent = action.payload;
    },
  },
});

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

export const { setSelected, setRenderContent } = histreeState.actions;

export const store = configureStore({
  reducer: histreeState.reducer,
});
