import React from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  NodeInfo,
  NodesList,
  AdjList,
  mockNodeInfo,
  mockAdjList,
  NodeId,
  RenderContent,
} from "../models";
import { getDepth } from "../stores/base";
import { useSelector } from "react-redux";
import TreeNodeCard from "./TreeNodeCard";
import dagre, { graphlib } from "dagre";

// const CENTER_X = 800;
// const CENTER_Y = 400;
const NODE_BOX_WIDTH = 155;
const NODE_BOX_HEIGHT = 50;

// Populate a Dagre graph with nodes and edges.
const populateGraph = (
  nodes: NodesList,
  adjList: AdjList,
  graph: graphlib.Graph
): void => {
  Object.keys(nodes).forEach((node) => {
    const { id, name } = nodes[node];
    graph.setNode(id, {
      label: name,
      width: NODE_BOX_WIDTH,
      height: NODE_BOX_HEIGHT,
    });
  });

  Object.keys(adjList).forEach((sourceId) => {
    adjList[sourceId].forEach((targetId) => {
      graph.setEdge(sourceId, targetId);
    });
  });
};

// Convert dagre graph to list of Nodes for React Flow rendering.
const dagreToFlowNodes = (graph: graphlib.Graph): Node[] => {
  const ns: Node[] = [];

  const dagreNodes = graph.nodes();
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  dagreNodes.forEach((n: any) => {
    const nodeObj = graph.node(n);
    if (nodeObj) {
      const flowNode: Node = {
        id: n,
        data: {
          label: <TreeNodeCard displayName={`${nodeObj.label}`} />,
        },
        position: { x: nodeObj.x, y: nodeObj.y },
        draggable: false,
        connectable: false,
        deletable: false,
      };
      ns.push(flowNode);
    }
  });
  return ns;
};

// Returns nodes to be displayed on the graph based on the depth provided.
const nodesToDisplay = (
  selectedNodeInfo: NodeInfo,
  nodesInfo: NodesList,
  adjList: AdjList,
  depth: number
): NodesList => {
  if (depth < 0) {
    return {};
  }

  const result: NodesList = {};
  // BFS find all ancestors
  const ancestorQueue: NodeInfo[] = [];

  if (depth == 0) {
    const result: NodesList = {};
    result[selectedNodeInfo.id] = selectedNodeInfo;
  }

  let currDepth: number = 1;
  ancestorQueue.push(selectedNodeInfo);

  while (currDepth <= depth) {
    const tmpList: NodeInfo[] = [];

    while (ancestorQueue.length > 0) {
      let generated = 0;
      // get node and find its direct ancestors
      const currNode: NodeInfo = ancestorQueue.shift()!;

      const ancestors: NodeId[] = [];
      Object.keys(adjList).forEach((nodeId) => {
        if (adjList[nodeId].includes(currNode.id)) {
          ancestors.push(nodeId);
        }
      });

      ancestors.forEach((nodeId) => {
        tmpList.push(nodesInfo[nodeId]);
      });
      result[currNode.id] = currNode;
    }
    tmpList.forEach((x) => {
      ancestorQueue.push(x);
    });
    currDepth++;
  }
  ancestorQueue.forEach((x) => (result[x.id] = x));

  // BFS find all descendants
  const descendantQueue: NodeInfo[] = [];
  currDepth = 1;
  descendantQueue.push(selectedNodeInfo);

  while (currDepth <= depth) {
    const tmpList: NodeInfo[] = [];

    while (descendantQueue.length > 0) {
      // get node and find its direct descendants
      const currNode: NodeInfo = descendantQueue.shift()!;

      if (Object.keys(adjList).includes(currNode.id)) {
        adjList[currNode.id].forEach((nodeId) => {
          tmpList.push(nodesInfo[nodeId]);
        });
      }
      result[currNode.id] = currNode;
    }
    tmpList.forEach((x) => {
      descendantQueue.push(x);
    });
    currDepth++;
  }
  descendantQueue.forEach((x) => (result[x.id] = x));

  result[selectedNodeInfo.id] = selectedNodeInfo;
  return result;
};

// Converts adjacency list to list of Edges for React Flow rendering.
const layoutEdges = (adjList: AdjList): Edge[] => {
  const completeEdges: Edge[] = [];

  Object.keys(adjList).forEach((source) => {
    adjList[source].forEach((target) => {
      const edge: Edge = {
        id: `${source}-${target}`,
        source: source,
        target: target,
        type: "step",
      };
      completeEdges.push(edge);
    });
  });

  return completeEdges;
};

const flowersToNodes = (flowers: NodeInfo[]): NodesList => {
  const result: NodesList = {};
  flowers.forEach((f) => {
    result[f.id] = f;
  });
  return result;
};

const Flow = (props: { content: RenderContent }) => {
  const depth = useSelector(getDepth);
  const { content } = props;

  const graph: graphlib.Graph = new graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(function () {
    return {};
  });

  const nodes = nodesToDisplay(
    content.flowers[0],
    flowersToNodes(content.flowers),
    content.branches,
    depth
  );
  populateGraph(nodes, content.branches, graph);
  dagre.layout(graph);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={dagreToFlowNodes(graph)}
        edges={layoutEdges(content.branches)}
        onNodeClick={(e) => console.log(e.target)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
