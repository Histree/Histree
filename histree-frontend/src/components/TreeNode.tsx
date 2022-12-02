import React, { CSSProperties, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setSelected,
	getNodeLookup,
	getRenderMode,
	setComparisonNode,
	setEdgeInfo,
	getCompareNodes,
	getEdgeInfo,
	getRelationship
} from '../stores/base';
import { HandleStatus, NodeId, NodeInfo, RelationshipInfo } from '../models';
import { Handle, Position } from 'reactflow';
import { useIsInViewport } from '../utils/viewport';
import { DataSuccess } from '../services';
import { withTheme } from '@emotion/react';
import './TreeNode.scss';

const nodeClassMap: Record<HandleStatus, string> = {
	Loading: 'handle_loading',
	Complete: 'handle_complete',
	NoData: 'handle_nodata',
	None: 'handle'
};

const TreeNode = ({ id }: { id: NodeId }) => {
	const ref = useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();
	const relationship = useSelector(getRelationship);
	const renderMode = useSelector(getRenderMode);
	const comparisonNodes = useSelector(getCompareNodes);
	const nodeLookup = useSelector(getNodeLookup);
	const edgeInfo = useSelector(getEdgeInfo);

	const data = nodeLookup[id];

	const handleNodeClick = () => {
		if (renderMode === 'View' || renderMode === 'Filter') {
			dispatch(
				setSelected({
					id: data.id,
					article: data.article,
					name: data.name,
					image: data?.image,
					attributes: data.petals,
					description: data?.description
					// links: details?.links,
				})
			);
		} else if (renderMode === 'Compare' || renderMode === 'Children') {
			dispatch(setEdgeInfo({}));
			dispatch(setComparisonNode(data));
		}
	};

	const getNodeStyle = (nodeid: NodeId): CSSProperties => {
		if (comparisonNodes.first && comparisonNodes.first.id === nodeid ||
			comparisonNodes.second && comparisonNodes.second.id === nodeid ||
			edgeInfo[nodeid] !== undefined) {
			switch (renderMode) {
				case 'Children':
					return { color: 'red', borderColor: 'red' };
				case 'Compare':
					if (relationship.status === 'Success' &&
						nodeid === (relationship as DataSuccess<RelationshipInfo>).content.ancestor) {
						return { color: 'orangered', borderColor: 'orangered' }
					}
					return { color: 'orange', borderColor: 'orange' };
			}
		}

		if (data.matchedFilter === false) {
			return { color: 'lightgray', borderColor: 'lightgray' };
		}
		return {}
	}

	return (
		<div ref={ref} className="tree-node" style={getNodeStyle(data.id)}>
			<Handle
				id="tree-target-handle"
				className={nodeClassMap[nodeLookup[data.id].upExpanded]}
				type="target"
				position={Position.Top}
				isConnectable
			/>
			<Handle
				id="spouse-target-handle"
				type="target"
				position={Position.Top}
				isConnectable
			/>
			<Handle
				id="spouse-source-handle"
				type="source"
				position={Position.Top}
				isConnectable
			/>
			<div className="tree-node-card" onClick={handleNodeClick}>
				<div className="tree-node-child">{data.name}</div>
			</div>
			<Handle
				id="tree-source-handle"
				className={nodeClassMap[nodeLookup[data.id].downExpanded]}
				type="source"
				position={Position.Bottom}
				isConnectable
			/>
		</div>
	);
};

export default TreeNode;
