import { NodeId } from "./graphInfo";

export interface ExpandInfo {
  searchedQid: NodeId;
  direction: "up" | "down" | "both";
}
