export type NodeId = string;

export type NodeInfo = {
  name: string;
  id: NodeId;
} & Record<string, string>;

export type AdjList = Record<NodeId, NodeId[]>;
export type NodesList = Record<NodeId, NodeInfo>;
