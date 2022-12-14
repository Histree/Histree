import React, { useEffect, useMemo, useState } from 'react';
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
import {
	AppDispatch,
	getCompareNodes,
	getEdgeInfo,
	getNodeLookup,
	getRenderContent,
	getRenderMode,
	setEdgeInfo,
	setRelationship,
	setSelected
} from '../stores';
import InvisibleConnectionLine from './general/InvisibleConnectionLine';
import { addChildrenNode, buildSpousesAdjList, findNodeChildren, findPathBetweenTwoNodes } from '../utils/utils';
import { fetchRelationship } from '../services';
import TreeEdge from './TreeEdge';
import SpouseEdge from './SpouseEdge';

const NODE_BOX_WIDTH = 155;
const NODE_BOX_HEIGHT = 50;

const Flow = (props: { content: RenderContent }) => {
	const { content } = props;
	const renderContent = useSelector(getRenderContent);
	const nodeLookup = useSelector(getNodeLookup);
	const renderMode = useSelector(getRenderMode);
	const comparisonNodes = useSelector(getCompareNodes);
	const edgeInfo = useSelector(getEdgeInfo);
	const dispatch = useDispatch();
	const appDispatch = useDispatch<AppDispatch>();
	const closeWindow = () => dispatch(setSelected(undefined));

	const { setCenter, viewportInitialized } = useReactFlow();
	const getEdgeAnimation = (first: NodeId, second: NodeId): boolean => {
		// console.log(`Getting Edge Style for ${first} and ${second}`);
		// Check if edgeinfo contains 'first' as key
		var sourceObject = edgeInfo[first];
		if (sourceObject !== undefined) {
			if (sourceObject[second]) {
				return true;
			}
		}
		// If the above condition fails to hold, check if edgeinfo contains 'second' as key
		sourceObject = edgeInfo[second];
		if (sourceObject !== undefined) {
			if (sourceObject[first] !== undefined) {
				// Edge is styled, return
				return true;
			}
		}
		// Edge is not styled, move on
		return false;
	}

	const nodeTypes = useMemo(() => ({ dataNode: TreeNode }), []);
	const edgeTypes = useMemo(() => ({ dataEdge: TreeEdge, spouseEdge: SpouseEdge }), []);
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
	const layoutEdges = (treeEdges: AdjList, spouseEdges: AdjList): Edge[] => {
		const completeEdges: Edge[] = [];

		Object.keys(treeEdges).forEach((source) => {
			treeEdges[source].forEach((target) => {
				const edge: Edge = {
					id: `${source}-${target}`,
					source: source,
					target: target,
					type: 'dataEdge',
					animated: getEdgeAnimation(source, target),
					sourceHandle: 'tree-source-handle',
					targetHandle: 'tree-target-handle',
				};
				completeEdges.push(edge)
			});
		});

		Object.keys(spouseEdges).forEach((source) => {
			spouseEdges[source].forEach((target) => {
				const edge: Edge = {
					id: `spouse-${source}-${target}`,
					source: source,
					target: target,
					type: 'spouseEdge',
					animated: true,
					style: { stroke: 'darkgray' },
					sourceHandle: 'spouse-source-handle',
					targetHandle: 'spouse-target-handle',
				}
				completeEdges.push(edge);
			});
		});
		return completeEdges;
	};

	const [flowNodes, setFlowNodes] = useState(dagreToFlowNodes(graph, content.branches));

	useEffect(() => {
		if (viewportInitialized && renderContent.status === 'Success') {
			console.log(renderContent.content);
			setCenter(
				flowNodes[renderContent.content.searchedQid].position.x,
				flowNodes[renderContent.content.searchedQid].position.y,
				{ zoom: 2, duration: 300 })
		}
	}, [viewportInitialized])

	useEffect(() => {
		setFlowNodes(dagreToFlowNodes(graph, content.branches));
	}, [graph, content.branches])

	useEffect(() => {
		if (
			comparisonNodes.first !== undefined &&
			comparisonNodes.second !== undefined
		) {
			if (renderMode === 'Compare') {
				appDispatch(fetchRelationship(comparisonNodes));
			} else if (renderMode === 'Children') {
				const result = findNodeChildren(
					comparisonNodes.first.id,
					comparisonNodes.second.id,
					addChildrenNode(content?.branches));
				dispatch(setEdgeInfo(result));
			}
		} else {
			dispatch(setRelationship({ status: 'Initial' }));
		}
	}, [comparisonNodes]);

	return (
		<div style={{ height: '100%' }}>
			<ReactFlow
				className="flow"
				nodes={Object.values(flowNodes)}
				edges={layoutEdges(
					content.branches,
					buildSpousesAdjList(
						nodeLookup,
						content.searchedQid
					)
				)}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				connectionLineComponent={InvisibleConnectionLine}
				onPaneClick={closeWindow}
			>
				<Background />
			</ReactFlow>
		</div >
	);
};

export default Flow;
