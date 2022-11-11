import React, { useEffect, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  NodeInfo,
  NodesList,
  AdjList,
  RenderContent,
  NodePositions,
  VisibleContent
} from '../models';
import TreeNode from './TreeNode';
import dagre, { graphlib } from 'dagre';
import { useSelector } from 'react-redux';
import { getVisible } from '../stores';
import InvisibleConnectionLine from './general/InvisibleConnectionLine';

// const CENTER_X = 800;
// const CENTER_Y = 400;
const NODE_BOX_WIDTH = 155;
const NODE_BOX_HEIGHT = 50;
// Populate a Dagre graph with nodes and edges.
const populateGraph = (
  nodes: NodesList,
  adjList: AdjList,
  graph: graphlib.Graph
): NodePositions => {
  const positions: NodePositions = {};
  Object.keys(nodes).forEach((node) => {
    const { id, name, petals } = nodes[node];
    graph.setNode(id, {
      label: name,
      qid: id,
      petals: petals,
      width: NODE_BOX_WIDTH,
      height: NODE_BOX_HEIGHT
    });
    positions[id] = graph.node(id);
  });

  Object.keys(adjList).forEach((sourceId) => {
    adjList[sourceId].forEach((targetId) => {
      graph.setEdge(sourceId, targetId);
    });
  });
  return positions;
};

// Convert dagre graph to list of Nodes for React Flow rendering.
const dagreToFlowNodes = (graph: graphlib.Graph): Node[] => {
  const ns: Node[] = [];

  const dagreNodes = graph.nodes();
  console.log(dagreNodes);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  dagreNodes.forEach((n: any) => {
    const nodeObj: any = graph.node(n);
    console.log(nodeObj);
    if (nodeObj) {
      const flowNode: Node = {
        id: n,
        type: 'dataNode',
        data: { name: nodeObj.label, id: n, petals: nodeObj.petals },
        position: { x: nodeObj.x, y: nodeObj.y },
        draggable: false,
        connectable: false,
        deletable: false
      };
      ns.push(flowNode);
    }
  });
  return ns;
};

// Returns nodes to be displayed on the graph.
const nodesToDisplay = (
  nodesInfo: NodesList,
  visible: VisibleContent
): NodesList => {
  const nodeVisibility = Object.keys(visible);

  const result: NodesList = {};
  for (const nodeId of nodeVisibility) {
    if (visible[nodeId]) {
      result[nodeId] = nodesInfo[nodeId];
    }
  }
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
        type: 'step'
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
  const { content } = props;

  const { setCenter, getZoom } = useReactFlow();
  const nodeTypes = useMemo(
    () => ({
      dataNode: TreeNode
    }),
    []
  );
  const visible = useSelector(getVisible);

  const graph: graphlib.Graph = new graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(function () {
    return {};
  });

  const nodes = nodesToDisplay(flowersToNodes(content.flowers), visible);
  const positions = populateGraph(nodes, content.branches, graph);
  dagre.layout(graph);

  useEffect(() => {
    setCenter(
      positions[content.searchedQid].x,
      positions[content.searchedQid].y,
      { duration: 800, zoom: getZoom() }
    );
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        className="flow"
        nodes={dagreToFlowNodes(graph)}
        edges={layoutEdges(content.branches)}
        nodeTypes={nodeTypes}
        nodeOrigin={[0.5, 0.5]}
        connectionLineComponent={InvisibleConnectionLine}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
