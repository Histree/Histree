import React from "react";
import ReactFlow, { Controls, Background, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { EdgeInfo, NodeInfo, mockNodeInfo, mockEdgeInfo } from "../models";
import TreeNodeCard from "./TreeNodeCard";

const CENTER_X = 700;
const CENTER_Y = 400;
const NODE_BOX_WIDTH = 150;

const HORIZONTAL_SPACING = NODE_BOX_WIDTH + 25;
const VERTICAL_SPACING = 100;

const layoutNodes = (nodesInfo: NodeInfo[], depth: number): Node[] => {
  const completeNodes: Node[] = [];

  const generated: number[] = new Array(depth * 2 + 1).fill(0);

  // Generate node for each node info
  nodesInfo.forEach((info) => {
    const level: number = info.distanceFromSource + depth;

    const offset = level % 2 == 0 ? HORIZONTAL_SPACING : 0;
    const xPos = CENTER_X + HORIZONTAL_SPACING * generated[level] - offset;
    const yPos = CENTER_Y + VERTICAL_SPACING * info.distanceFromSource;

    const node: Node = {
      id: info.id,
      data: { label: <TreeNodeCard displayName={`${info.name}`} /> },
      position: { x: xPos, y: yPos },
      type: "default",
    };

    completeNodes.push(node);
    generated[level]++;
  });

  return completeNodes;
};

const layoutEdges = (edgesInfo: EdgeInfo[]): Edge[] => {
  const completeEdges: Edge[] = [];

  edgesInfo.forEach((edgeInfo) => {
    const edge: Edge = {
      id: `${edgeInfo.sourceId}-${edgeInfo.targetId}`,
      source: edgeInfo.sourceId,
      target: edgeInfo.targetId,
      type: "step",
    };
    completeEdges.push(edge);
  });

  return completeEdges;
};

const Flow = () => {
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={layoutNodes(mockNodeInfo, 1)}
        edges={layoutEdges(mockEdgeInfo)}
        onNodeClick={(e) => console.log(e.target)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
