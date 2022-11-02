import { AdjList, NodesList } from "./graphInfo";

const mockAdjList: AdjList = {
  2: ["10", "11", "5", "6", "7", "12", "13", "14", "15"],
  3: ["2"],
  4: ["2"],
  8: ["3"],
  9: ["3"],
  10: ["18", "19", "20", "21", "22", "23", "24", "25"],
  11: ["26", "27", "28", "29", "30", "31"],
  16: ["4"],
  17: ["4"],
};

const mockNodeInfo: NodesList = {
  2: { name: "Queen Victoria", id: "2" },
  3: { name: "Prince Edward", id: "3" },
  4: { name: "Princess Victoria", id: "4" },
  5: { name: "Princess Alice", id: "5" },
  6: { name: "Prince Alfred", id: "6" },
  7: { name: "Princess Helena", id: "7" },
  8: { name: "George III", id: "8" },
  9: { name: "Queen Charlotte", id: "9" },
  10: { name: "Victoria", id: "10" },
  11: { name: "Edward VII", id: "11" },
  12: { name: "Princess Louise", id: "12" },
  13: { name: "Prince Arthur", id: "13" },
  14: { name: "Prince Leopold", id: "14" },
  15: { name: "Princess Beatrice", id: "15" },
  16: { name: "Duke Francis", id: "16" },
  17: { name: "Countess Augusta", id: "17" },
  18: { name: "Wilhelm II", id: "18" },
  19: { name: "Princess Charlotte", id: "19" },
  20: { name: "Prince Henry", id: "20" },
  21: { name: "Prince Sigismund", id: "21" },
  22: { name: "Princess Viktoria", id: "22" },
  23: { name: "Prince Waldemar", id: "23" },
  24: { name: "Queen Sophia", id: "24" },
  25: { name: "Princess Margaret", id: "25" },
  26: { name: "Prince Albert Victor", id: "26" },
  27: { name: "King George V", id: "27" },
  28: { name: "Princess Louise", id: "28" },
  29: { name: "Princess Victoria", id: "29" },
  30: { name: "Queen Maud", id: "30" },
  31: { name: "Prince Alexander John", id: "31" },
};

export { mockAdjList, mockNodeInfo };
