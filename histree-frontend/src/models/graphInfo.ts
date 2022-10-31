export interface NodeInfo {
  name: string;
  id: string;
  distanceFromSource: number;
}

export interface EdgeInfo {
  sourceId: string;
  targetId: string;
}
