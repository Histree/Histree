import { AdjList, NodeId, NodeInfo } from "./graphInfo";

export interface RenderContent {
  searchedQid: NodeId;
  branches: AdjList;
  flowers: NodeInfo[];
}
