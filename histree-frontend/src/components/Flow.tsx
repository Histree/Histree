import React, { CSSProperties, useEffect, useMemo } from 'react';
import ReactFlow, {
	Controls,
	Background,
	Node,
	Edge,
	useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeLookup, AdjList, RenderContent, NodePositions, NodeId } from '../models';
import TreeNode from './TreeNode';
import dagre, { graphlib } from 'dagre';
import { useDispatch, useSelector } from 'react-redux';
import { getCompareNodes, getEdgeInfo, getNodeLookup, setSelected } from '../stores';
import InvisibleConnectionLine from './general/InvisibleConnectionLine';
import { CompareNodes } from '../models/compareInfo';

// const CENTER_X = 800;
// const CENTER_Y = 400;
const NODE_BOX_WIDTH = 155;
const NODE_BOX_HEIGHT = 50;


const Flow = (props: { content: RenderContent }) => {
	const { content } = props;
	const nodeLookup = useSelector(getNodeLookup);
	const comparisonNodes = useSelector(getCompareNodes);
	const edgeInfo = useSelector(getEdgeInfo);
	const dispatch = useDispatch();

	const closeWindow = () => dispatch(setSelected(undefined));

	const { setCenter, getZoom } = useReactFlow();
	const getEdgeStyle = (first: NodeId, second: NodeId): CSSProperties | undefined => {
		console.log(`Getting Edge Style for ${first} and ${second}`);
		// Check if edgeinfo contains 'first' as key
		var sourceObject = edgeInfo[first];
		if (sourceObject !== undefined) {
			const sourceKey = Object.keys(sourceObject)[0];
			// Check if object contained within 'first' has correct key
			// i.e. nested key is === second
			console.log(Object.keys(sourceObject)[0], first, second);
			if (sourceKey === second) {
				return sourceObject[second];
			}
		}
		// If the above condition fails to hold, check if edgeinfo contains 'second' as key
		sourceObject = edgeInfo[second];
		if (sourceObject === undefined) {
			// Edge is not styled, move on
			return undefined;
		}
		// Edge is styled, return
		return sourceObject[first];
	}

	const getNodeStyle = (nodeid: NodeId): CSSProperties => {
		if (comparisonNodes.first && comparisonNodes.first.id === nodeid ||
			comparisonNodes.second && comparisonNodes.second.id === nodeid ||
			edgeInfo[nodeid] !== undefined) {
			return { color: 'orange', borderColor: 'orange' };
		}
		return {}
	}

	const nodeTypes = useMemo(
		() => ({
			dataNode: TreeNode
		}),
		[]
	);
	const graph: graphlib.Graph = new graphlib.Graph();
	graph.setGraph({});
	graph.setDefaultEdgeLabel(function () {
		return {};
	});

	// Populate a Dagre graph with nodes and edges.
	const populateGraph = (
		nodes: NodeLookup,
		adjList: AdjList,
		graph: graphlib.Graph
	): NodePositions => {
		const positions: NodePositions = {};
		Object.keys(nodes).forEach((node) => {
			if (nodes[node].visible) {
				const { id, name, petals, description } = nodes[node];
				graph.setNode(id, {
					label: name,
					qid: id,
					petals: petals,
					description: description,
					width: NODE_BOX_WIDTH,
					height: NODE_BOX_HEIGHT
				});
				positions[id] = graph.node(id);
			}
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

			if (nodeObj) {
				const flowNode: Node = {
					id: n,
					type: 'dataNode',
					data: {
						name: nodeObj.label,
						description: nodeObj.description,
						id: n,
						petals: nodeObj.petals
					},
					style: getNodeStyle(n),
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

	const positions = populateGraph(nodeLookup, content.branches, graph);
	dagre.layout(graph);

	// Converts adjacency list to list of Edges for React Flow rendering.
	const layoutEdges = (adjList: AdjList): Edge[] => {
		const completeEdges: Edge[] = [];
		const comparisonEdges: Edge[] = [];

		Object.keys(adjList).forEach((source) => {
			adjList[source].forEach((target) => {
				const style = getEdgeStyle(source, target);
				const edge: Edge = {
					id: `${source}-${target}`,
					source: source,
					target: target,
					// type: 'step',
					style: style
				};
				if (style === undefined) {
					completeEdges.push(edge)
				} else {
					comparisonEdges.push(edge)
				};
			});
		});
		for (const e of comparisonEdges) {
			e.animated = true;
			completeEdges.push(e)
		}
		console.log('COMPARISON');
		console.log(comparisonEdges);
		console.log('COMPLETE');
		console.log(completeEdges);

		return completeEdges;
	};

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
				onPaneClick={closeWindow}
			>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default Flow;
