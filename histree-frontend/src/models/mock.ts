import { AdjList, NodesList } from "./graphInfo";

const mockAdjList: AdjList = {
  2: ["10", "11", "5", "6", "7", "12", "13", "14", "15"],
  3: ["2"],
  4: ["2"],
  5: [],
  6: [],
  7: [],
  8: ["3"],
  9: ["3"],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: [],
};

const mockNodeInfo: NodesList = {
  2: { name: "Queen Victoria", id: "2", distanceFromSource: 0 },
  3: { name: "Prince Edward", id: "3", distanceFromSource: -1 },
  4: { name: "Princess Victoria", id: "4", distanceFromSource: -1 },
  5: { name: "Princess Alice", id: "5", distanceFromSource: 1 },
  6: { name: "Prince Alfred", id: "6", distanceFromSource: 1 },
  7: { name: "Princess Helena", id: "7", distanceFromSource: 1 },
  8: { name: "George III", id: "8", distanceFromSource: 1 },
  9: {
    name: "Queen Charlotte",
    id: "9",
    distanceFromSource: 1,
  },
  10: { name: "Victoria", id: "10", distanceFromSource: 1 },
  11: { name: "Edward VII", id: "11", distanceFromSource: 1 },
  12: { name: "Princess Louise", id: "12", distanceFromSource: 1 },
  13: { name: "Prince Arthur", id: "13", distanceFromSource: 1 },
  14: { name: "Prince Leopold", id: "14", distanceFromSource: 1 },
  15: { name: "Princess Beatrice", id: "15", distanceFromSource: 1 },
};

export { mockAdjList, mockNodeInfo };
