import { NodeInfo, EdgeInfo } from "./graphInfo";

const mockNodeInfo: NodeInfo[] = [
  { name: "Queen Victoria", id: "2", distanceFromSource: 0 },
  { name: "Prince Edward", id: "3", distanceFromSource: -1 },
  { name: "Princess Victoria", id: "4", distanceFromSource: -1 },
  { name: "Princess Alice", id: "5", distanceFromSource: 1 },
  { name: "Prince Alfred", id: "6", distanceFromSource: 1 },
  { name: "Princess Helena", id: "7", distanceFromSource: 1 },
];

const mockEdgeInfo: EdgeInfo[] = [
  {
    sourceId: "3",
    targetId: "2",
  },
  {
    sourceId: "4",
    targetId: "2",
  },
  {
    sourceId: "1",
    targetId: "5",
  },
  {
    sourceId: "1",
    targetId: "6",
  },
  {
    sourceId: "1",
    targetId: "7",
  },
  {
    sourceId: "2",
    targetId: "5",
  },
  {
    sourceId: "2",
    targetId: "6",
  },
  {
    sourceId: "2",
    targetId: "7",
  },
];

export { mockNodeInfo, mockEdgeInfo };
