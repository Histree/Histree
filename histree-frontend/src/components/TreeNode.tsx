import React, { CSSProperties, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setSelected,
	getRenderContent,
	getNodeLookup,
	setNodeLookup,
	setNodeLookupDown,
	setNodeLookupUp,
	getRenderMode,
	setComparisonNode,
	setEdgeInfo,
	getCompareNodes,
	setNodeOnScreen,
	getEdgeInfo
} from '../stores/base';
import { HandleStatus, NodeId, NodeInfo } from '../models';
import './TreeNode.scss';
import { Handle, Position } from 'reactflow';
import { useIsInViewport } from '../utils/viewport';

const nodeClassMap: Record<HandleStatus, string> = {
	Loading: 'handle_loading',
	Complete: 'handle_complete',
	NoData: 'handle_nodata',
	None: 'handle'
};

const TreeNode = ({ data }: { data: NodeInfo }) => {
	const ref = useRef<HTMLInputElement>(null);

	const isInView = useIsInViewport(ref);
	const dispatch = useDispatch();
	const renderMode = useSelector(getRenderMode);
	const comparisonNodes = useSelector(getCompareNodes);
	const renderContent = useSelector(getRenderContent);
	const nodeLookup = useSelector(getNodeLookup);
	const edgeInfo = useSelector(getEdgeInfo);

	useEffect(() => {
		if (isInView) {
			dispatch(setNodeOnScreen({ id: data.id, onScreen: isInView }))
		}
	}, [isInView])

	const handleNodeClick = () => {
		if (renderMode === 'View') {
			dispatch(
				setSelected({
					name: data.name,
					image: data?.image,
					attributes: data.petals,
					description: data?.description
					// links: details?.links,
				})
			);
		} else if (renderMode === 'Compare') {
			dispatch(setEdgeInfo({}));
			dispatch(setComparisonNode(data));
		}
	};

	const handleExpandParents = (): void => {
		if (nodeLookup[data.id] !== undefined && nodeLookup[data.id].searched) {
			return;
		}
		dispatch(setNodeLookupUp({ searchedQid: data.id, status: 'Loading' }));
		if (renderContent.status === 'Success') {
			const { branches } = renderContent.content!;
			const nodes = { ...nodeLookup };

			// if (!nodes[data.id].searched) {
			// 	appDispatch(
			// 		fetchSelectedExpansion({ searchedQid: data.id, direction: 'up' })
			// 	);
			// } else {
			if (branches[data.id]) {
				Object.keys(branches).forEach((parentId) => {
					if (branches[parentId].includes(data.id)) {
						const parent = { ...nodes[parentId] };
						parent.visible = true;
						nodes[parentId] = parent;
					}
				});
				dispatch(setNodeLookup(nodes));
				// }
				dispatch(setNodeLookupUp({ searchedQid: data.id, status: 'Complete' }));
			}
		}
	};

	const handleExpandChildren = (): void => {
		if (nodeLookup[data.id] !== undefined && nodeLookup[data.id].searched) {
			return;
		}
		dispatch(setNodeLookupDown({ searchedQid: data.id, status: 'Loading' }));
		if (renderContent.status === 'Success') {
			const { branches } = renderContent.content!;
			const nodes = { ...nodeLookup };

			// if (!nodes[data.id].searched) {
			// 	appDispatch(
			// 		fetchSelectedExpansion({ searchedQid: data.id, direction: 'down' })
			// 	);
			// } else {
			if (branches[data.id]) {
				branches[data.id].forEach((childId) => {
					console.log(nodes[childId]);
					const child = { ...nodes[childId] };
					child.visible = true;
					nodes[childId] = child;
				});
				dispatch(setNodeLookup(nodes));
			}
			dispatch(
				setNodeLookupDown({ searchedQid: data.id, status: 'Complete' })
			);
			// }
		}
	};

	const getNodeStyle = (nodeid: NodeId): CSSProperties => {
		if (comparisonNodes.first && comparisonNodes.first.id === nodeid ||
			comparisonNodes.second && comparisonNodes.second.id === nodeid ||
			edgeInfo[nodeid] !== undefined) {
			return { color: 'orange', borderColor: 'orange' };
		} else if (data.matchedFilter === false) {
			return { color: 'lightgray', borderColor: 'lightgray' };
		}
		return {}
	}

	return (
		<div ref={ref} className="tree-node" style={getNodeStyle(data.id)}>
			{nodeLookup[data.id].visible ? <>
				<Handle
					className={nodeClassMap[nodeLookup[data.id].upExpanded]}
					type="target"
					position={Position.Top}
					isConnectable
					onClick={handleExpandParents}
				/>
				<div className="tree-node-card" onClick={handleNodeClick}>
					<div className="tree-node-child">{data.name}</div>
				</div>

				<Handle
					className={nodeClassMap[nodeLookup[data.id].downExpanded]}
					type="source"
					position={Position.Bottom}
					isConnectable
					onClick={handleExpandChildren}
				/>
			</> : <div></div>}
		</div>
	);
};

export default TreeNode;
