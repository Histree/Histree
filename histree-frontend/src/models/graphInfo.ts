export type NodeId = string;

export interface NodeInfo {
  name: string;
  id: NodeId;
}

export type AdjList = Record<NodeId, NodeId[]>;
export type NodesList = Record<NodeId, NodeInfo>;
