export type NodeId = string;

export type NodeInfo = {
  name: string;
  id: NodeId;
  description?: string;
  petals?: Record<string, string>;
  searched?: boolean;
  visible?: boolean;
} & Record<string, string>;

export type AdjList = Record<NodeId, NodeId[]>;
export type NodeLookup = Record<NodeId, NodeInfo>;

export type NodePositions = Record<NodeId, { x: number; y: number }>;
