import {
  AdjList,
  EdgeChildInfo,
  EdgeInfo,
  NodeId,
  NodeLookup,
} from "../models";

// export const cleanseBranches = (
//   adjList: AdjList | undefined,
//   lookup: NodeLookup
// ): AdjList => {
//   if (adjList === undefined) {
//     return {};
//   }
//   const newAdjList = { ...adjList };
//   Object.entries(adjList).forEach(([parent, children]) => {
//     if (lookup[parent] !== undefined && !lookup[parent].visible) {
//       // eslint-disable-next-line
//       delete newAdjList[parent];
//     } else {
//       children.forEach((c) => {
//         if (lookup[c] !== undefined && !lookup[c].visible) {
//           newAdjList[parent] = newAdjList[parent].filter((i) => i !== c);
//         }
//       });
//     }
//   });
//   return newAdjList;
// };

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
