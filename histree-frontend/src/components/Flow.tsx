import React from "react";
import ReactFlow, { Controls, Background, Node, Edge, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import {
	NodeInfo,
	AdjList,
	mockNodeInfo,
	mockAdjList,
	NodeId,
} from "../models";
import { getDepth } from "../stores/base";
import { useSelector } from "react-redux";
import TreeNodeCard from "./TreeNodeCard";

const CENTER_X = 800;
const CENTER_Y = 400;
const NODE_BOX_WIDTH = 150;

const HORIZONTAL_SPACING = NODE_BOX_WIDTH + 25;
const VERTICAL_SPACING = 100;

const layoutNodes = (
	selectedNodeInfo: NodeInfo,
	adjList: AdjList,
	depth: number
): Node[] => {
	if (depth < 0) {
		return [];
	}

	const result: Node[] = [];
	// BFS find all ancestors
	const ancestorQueue: Node[] = [];

	const selectedNode: Node = {
		id: selectedNodeInfo.id,
		data: { label: <TreeNodeCard displayName={`${selectedNodeInfo.name}`} /> },
		position: { x: CENTER_X, y: CENTER_Y },
		type: "default",
	};

	if (depth == 0) {
		return [selectedNode];
	}

	let currDepth: number = 1;
	ancestorQueue.push(selectedNode);

	while (currDepth <= depth) {
		const tmpList: Node[] = [];

		while (ancestorQueue.length > 0) {
			let generated = 0;
			// get node and find its direct ancestors
			const currNode: Node = ancestorQueue.shift()!;

			const ancestors: NodeId[] = [];
			Object.keys(adjList).forEach((nodeId) => {
				if (adjList[nodeId].includes(currNode.id)) {
					ancestors.push(nodeId);
				}
			});

			const offset = HORIZONTAL_SPACING / 2;
			let xPos =
				ancestors.length % 2 == 0
					? currNode.position.x -
					(HORIZONTAL_SPACING * currDepth * ancestors.length) / 2 +
					offset
					: currNode.position.x -
					(HORIZONTAL_SPACING * currDepth * (ancestors.length - 1)) / 2;

			ancestors.forEach((nodeId) => {
				// node is an ancestor
				const n: Node = {
					id: nodeId,
					data: {
						label: (
							<TreeNodeCard displayName={`${mockNodeInfo[nodeId].name}`} />
						),
					},
					position: {
						x: xPos,
						y: currNode.position.y - VERTICAL_SPACING,
					},
					type: "default",
				};
				tmpList.push(n);
				xPos += HORIZONTAL_SPACING;
			});
			result.push(currNode);
		}
		tmpList.forEach((x) => {
			ancestorQueue.push(x);
		});
		currDepth++;
	}
	ancestorQueue.forEach((x) => result.push(x));

	// BFS find all descendants
	const descendantQueue: Node[] = [];
	currDepth = 1;
	descendantQueue.push(selectedNode);

	while (currDepth <= depth) {
		const tmpList: Node[] = [];

		while (descendantQueue.length > 0) {
			// get node and find its direct descendants
			const currNode: Node = descendantQueue.shift()!;
			const offset = HORIZONTAL_SPACING / 2;

			let xPos =
				adjList[currNode.id].length % 2 == 0
					? currNode.position.x -
					(HORIZONTAL_SPACING * currDepth * adjList[currNode.id].length) / 2 +
					offset
					: currNode.position.x -
					(HORIZONTAL_SPACING *
						currDepth *
						(adjList[currNode.id].length - 1)) /
					2;

			adjList[currNode.id].forEach((nodeId) => {
				const n: Node = {
					id: nodeId,
					data: {
						label: (
							<TreeNodeCard displayName={`${mockNodeInfo[nodeId].name}`} />
						),
					},
					position: {
						x: xPos,
						y: currNode.position.y + VERTICAL_SPACING,
					},
					type: "default",
				};
				tmpList.push(n);
				xPos += HORIZONTAL_SPACING;
			});
			result.push(currNode);
		}
		tmpList.forEach((x) => {
			descendantQueue.push(x);
		});
		currDepth++;
	}
	descendantQueue.forEach((x) => result.push(x));

	result.push(selectedNode);
	return result;
};

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

const Flow = () => {
	const depth = useSelector(getDepth);
	return (
		<div style={{ height: "100%" }}>
			<ReactFlow
				nodes={layoutNodes(mockNodeInfo["2"], mockAdjList, depth)}
				edges={layoutEdges(mockAdjList)}
				onNodeClick={(e) => console.log(e.target)}
			>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default Flow;
