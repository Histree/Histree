import {
  AdjList,
  CardLocation,
  EdgeChildInfo,
  EdgeInfo,
  NodeId,
  NodeLookup,
  RenderContent,
  Url,
} from "../models";
import { ServiceStatus } from "../services";

export const addChildrenNode = (adjList: AdjList): AdjList => {
  const newAdjList = { ...adjList };
  Object.values(adjList).forEach((children) => {
    children.forEach((child) => {
      if (newAdjList[child] === undefined) {
        newAdjList[child] = [];
      }
    });
  });
  return newAdjList;
};

export const convertToUndirected = (adjList: AdjList): AdjList => {
  const newAdjList = { ...adjList };
  Object.entries(adjList).forEach(([parent, children]) => {
    children.forEach((child) => {
      if (newAdjList[child] === undefined) {
        newAdjList[child] = [parent];
      } else {
        const childList = [...newAdjList[child]];
        if (!childList.includes(parent)) {
          childList.push(parent);
          newAdjList[child] = childList;
        }
      }
    });
  });
  return newAdjList;
};
export const findNodeChildren = (
  node1: NodeId,
  node2: NodeId,
  adjList: AdjList
): EdgeInfo => {
  const node1Children = adjList[node1];
  const node2Children = adjList[node2];
  console.log(node1Children);
  console.log(node2Children);
  const edgeInfo: EdgeInfo = {};
  node1Children.forEach((child) => {
    console.log(child);
    if (node2Children.includes(child)) {
      const node2CSS: EdgeChildInfo = {};
      const node1CSS: EdgeChildInfo = {};
      node2CSS[node2] = { stroke: "red", strokeWidth: "0.1em" };
      node1CSS[node1] = { stroke: "red", strokeWidth: "0.1em" };
      edgeInfo[child] = { ...node1CSS, ...node2CSS };
    }
  });
  return edgeInfo;
};

export const findPathBetweenTwoNodes = (
  node1: NodeId,
  node2: NodeId,
  adjList: AdjList
): EdgeInfo => {
  // Convert adjacency list from directed to undirected
  const newAdjList = convertToUndirected(adjList);
  console.log("NEW ADJ LIST");
  console.log(newAdjList);
  return findPath(node1, node2, newAdjList);
};

const findPath = (source: NodeId, target: NodeId, graph: AdjList): EdgeInfo => {
  if (graph[source] === undefined || graph[target] === undefined) {
    return {};
  }

  const queue = [source];
  const visited = new Set();
  const path = new Map();

  while (queue.length > 0) {
    const start = queue.shift() as NodeId;

    if (start === target) {
      return buildPath(start, path);
    }
    if (graph[start] !== undefined) {
      for (const next of graph[start]) {
        if (visited.has(next)) {
          continue;
        }

        if (!queue.includes(next)) {
          path.set(next, start);
          queue.push(next);
        }
      }
    }

    visited.add(start);
  }

  return {};
};

const buildPath = (target: NodeId, path: Map<NodeId, NodeId>): EdgeInfo => {
  const result: EdgeInfo = {};

  while (path.get(target) !== undefined) {
    const source = path.get(target) as NodeId;
    const targetCSS: EdgeChildInfo = {};
    targetCSS[target] = { stroke: "orange", strokeWidth: "0.3em" };
    result[source] = targetCSS;
    target = source;
  }

  return result;
};

export const mapsURL = (loc: CardLocation): Url => {
  const lat = loc.coordinate_location.latitude;
  const long = loc.coordinate_location.longitude;
  const url =
    "https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + long;
  return url;
};

export const buildSpousesAdjList = (
  nodeLookup: NodeLookup,
  focusQid: NodeId
): AdjList => {
  const adjList: AdjList = {};
  adjList[focusQid] = [];
  const petals = nodeLookup[focusQid].petals;
  if (petals) {
    const spouses: Record<number, NodeId> = petals.spouse;
    if (spouses) {
      Object.values(spouses).forEach((s) => {
        if (!adjList[s]) {
          adjList[focusQid].push(s);
        }
      });
    }
  }
  return adjList;
};

export const getArcPath = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): string => {
  const controlX = (sourceX + targetX) / 2;
  const controlY = Math.min(sourceY, targetY) - 50;
  return `M${sourceX},${sourceY} Q${controlX},${controlY} ${targetX},${targetY}`;
};

export const isContentAvail = (
  renderContent: ServiceStatus<RenderContent>
): boolean => {
  return (
    (renderContent.status === "Success" ||
      renderContent.status === "Failure") &&
    renderContent.content !== undefined
  );
};
