import React, { CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	getRenderContent,
	getNodeLookup,
	getRenderMode,
	getCompareNodes,
	getEdgeInfo
} from '../stores/base';
import './TreeEdge.scss';
import { EdgeProps, getBezierPath, getSmoothStepPath } from 'reactflow';

// sourceX: number;
// sourceY: number;
// sourcePosition?: Position;
// targetX: number;
// targetY: number;
// targetPosition?: Position;
// borderRadius?: number;
// centerX?: number;
// centerY?: number;
// offset?: number;
const TreeEdge = ({
	id,
	source,
	target,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd,
}: EdgeProps) => {
	const dispatch = useDispatch();
	const renderMode = useSelector(getRenderMode);
	const comparisonNodes = useSelector(getCompareNodes);
	const renderContent = useSelector(getRenderContent);
	const nodeLookup = useSelector(getNodeLookup);
	const edgeInfo = useSelector(getEdgeInfo);
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});
	const getEdgeStyle = (): CSSProperties => {
		// Check if edgeinfo contains 'first' as key
		var sourceObject = edgeInfo[source];
		if (sourceObject !== undefined) {
			const sourceKey = Object.keys(sourceObject)[0];
			// Check if object contained within 'first' has correct key
			// i.e. nested key is === second
			if (sourceKey === target) {
				return sourceObject[target];
			}
		}
		// If the above condition fails to hold, check if edgeinfo contains 'second' as key
		sourceObject = edgeInfo[target];
		if (sourceObject === undefined) {
			// Edge is not styled, move on
			return {};
		}
		// Edge is styled, return
		return sourceObject[source];
	}
	const style = getEdgeStyle();
	return (
		<path
			id={id}
			style={style}
			d={edgePath}
			markerEnd={markerEnd}
			className="react-flow__edge-path"

		/>
	);
}

export default TreeEdge;
