import { AdjList, NodeId, NodeInfo } from "./graphInfo";

export type RenderMode = "View" | "Compare" | "Children";

export interface RenderContent {
  searchedQid: NodeId;
  branches: AdjList;
  flowers: NodeInfo[];
}

export interface SearchBarInfo {
  searchTerm: string;
  autocompleteData: Record<string, AutoCompleteData>;
}
export interface AutoCompleteData {
  description: string;
  id: NodeId;
  label: string;
}

export interface RelationshipInfo {
  relationship?: string;
}
