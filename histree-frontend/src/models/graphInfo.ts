export type NodeId = string;

export type HandleStatus = "None" | "Loading" | "Complete" | "NoData";

export type NodeInfo = {
  article: string;
  name: string;
  id: NodeId;
  description?: string;
  petals?: Record<string, string>;
  searched: boolean;
  visible: boolean;
  upExpanded: HandleStatus;
  downExpanded: HandleStatus;
  matchedFilter: boolean;
} & Record<string, string>;

export type AdjList = Record<NodeId, NodeId[]>;
export type NodeLookup = Record<NodeId, NodeInfo>;

export type NodePositions = Record<NodeId, { x: number; y: number }>;
