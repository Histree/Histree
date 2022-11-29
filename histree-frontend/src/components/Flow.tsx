import React, { CSSProperties, useEffect, useMemo } from 'react';
import ReactFlow, {
	Controls,
	Background,
	Node,
	Edge,
	useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeLookup, AdjList, RenderContent, NodePositions, NodeId } from '../models';
import TreeNode from './TreeNode';
import dagre, { graphlib } from 'dagre';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, getCompareNodes, getCurrentViewport, getEdgeInfo, getNodeLookup, setEdgeInfo, setRelationship, setSelected } from '../stores';
import InvisibleConnectionLine from './general/InvisibleConnectionLine';
import { findPathBetweenTwoNodes } from '../utils/utils';
import { DataSuccess, fetchRelationship } from '../services';
import TreeEdge from './TreeEdge';

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
	const appDispatch = useDispatch<AppDispatch>();
	const closeWindow = () => dispatch(setSelected(undefined));

	const { setCenter, getZoom, viewportInitialized } = useReactFlow();
	const getEdgeAnimation = (first: NodeId, second: NodeId): boolean => {
		// console.log(`Getting Edge Style for ${first} and ${second}`);
		// Check if edgeinfo contains 'first' as key
		var sourceObject = edgeInfo[first];
		if (sourceObject !== undefined) {
			const sourceKey = Object.keys(sourceObject)[0];
			// Check if object contained within 'first' has correct key
			// i.e. nested key is === second
			if (sourceKey === second) {
				return true;
			}
		}
		// If the above condition fails to hold, check if edgeinfo contains 'second' as key
		sourceObject = edgeInfo[second];
		if (sourceObject !== undefined) {
			const sourceKey = Object.keys(sourceObject)[0];
			if (sourceKey === first) {
				// Edge is styled, return
				return true;
			}
		}
		// Edge is not styled, move on
		return false;
	}

	const nodeTypes = useMemo(() => ({ dataNode: TreeNode }), []);
	const edgeTypes = useMemo(() => ({ dataEdge: TreeEdge }), []);
	var graph: graphlib.Graph = new graphlib.Graph();
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
			// if (nodes[node].visible) {
			const { id, name, petals, description, article } = nodes[node];
			graph.setNode(id, {
				label: name,
				qid: id,
				petals: petals,
				description: description,
				article: article,
				width: NODE_BOX_WIDTH,
				height: NODE_BOX_HEIGHT
			});
			positions[id] = graph.node(id);
			// }
		});

		Object.keys(adjList).forEach((sourceId) => {
			adjList[sourceId].forEach((targetId) => {
				graph.setEdge(sourceId, targetId);
			});
		});
		return positions;
	};

	// Convert dagre graph to list of Nodes for React Flow rendering.
	const dagreToFlowNodes = (graph: graphlib.Graph, adjList: AdjList): Record<NodeId, Node> => {
		const ns: Record<NodeId, Node> = {};
		dagre.layout(graph)
		const dagreNodes = graph.nodes();
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
						petals: nodeObj.petals,
						article: nodeObj.article
					},
					// hidden: !nodeLookup[n].visible,
					position: { x: nodeObj.x, y: nodeObj.y },
					draggable: false,
					connectable: false,
					deletable: false
				};
				ns[n] = flowNode;
			}
		});
		return ns;
	};

	const positions = populateGraph(nodeLookup, content.branches, graph);

	// Converts adjacency list to list of Edges for React Flow rendering.
	const layoutEdges = (adjList: AdjList): Edge[] => {
		const completeEdges: Edge[] = [];
		const comparisonEdges: Edge[] = [];

		Object.keys(adjList).forEach((source) => {
			adjList[source].forEach((target) => {
				const edge: Edge = {
					id: `${source}-${target}`,
					source: source,
					target: target,
					type: 'dataEdge',
					animated: getEdgeAnimation(source, target)
				};
				completeEdges.push(edge)
			});
		});

		return completeEdges;
	};

	const flowNodes = dagreToFlowNodes(graph, content.branches)

	useEffect(() => {
		if (viewportInitialized) {
			setCenter(
				flowNodes[content.searchedQid].position.x,
				flowNodes[content.searchedQid].position.y,
				{ zoom: 2, duration: 300 })
		}
	}, [viewportInitialized])

	useEffect(() => {
		if (
			comparisonNodes.first !== undefined &&
			comparisonNodes.second !== undefined
		) {
			const result = findPathBetweenTwoNodes(
				comparisonNodes.first.id,
				comparisonNodes.second.id,
				// cleanseBranches(content?.branches, nodeLookup)
				content?.branches
			);
			console.log(result);
			dispatch(setEdgeInfo(result));
			appDispatch(fetchRelationship(comparisonNodes));
		} else {
			dispatch(setRelationship({ status: 'Initial' }));
		}
	}, [comparisonNodes]);


	return (
		<div style={{ height: '100%' }}>
			<ReactFlow
				className="flow"
				nodes={Object.values(flowNodes)}
				edges={layoutEdges(content.branches)}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				connectionLineComponent={InvisibleConnectionLine}
				// fitView
				onPaneClick={closeWindow}
			>
				<Background />
				<Controls />
			</ReactFlow>
		</div >
	);
};

export default Flow;
