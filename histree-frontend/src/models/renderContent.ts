import { AdjList, NodeId, NodeInfo } from "./graphInfo";

export interface RenderContent {
  searchedQid: NodeId;
  branches: AdjList;
  flowers: NodeInfo[];
}

export type VisibleContent = Record<NodeId, boolean>;
