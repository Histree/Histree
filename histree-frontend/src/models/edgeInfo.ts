import { CSSProperties } from "react";
import { NodeId } from "./graphInfo";

export type EdgeInfo = Record<NodeId, EdgeChildInfo>;

export type EdgeChildInfo = Record<
  NodeId,
  CSSProperties & Record<string, string>
>;
