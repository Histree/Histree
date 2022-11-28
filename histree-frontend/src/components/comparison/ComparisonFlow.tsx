import React from 'react';
import { useSelector } from 'react-redux';
import ReactFlow, { Position, Node } from 'reactflow';
import { RelationshipInfo } from '../../models';
import { CompareNodes } from '../../models/compareInfo';
import { ServiceStatus } from '../../services';
import { getCompareNodes, getRelationship, getRenderContent } from '../../stores';
import './ComparisonFlow.scss';

const comparisonFlowNodeBase: Partial<Node> = {
	style: { fontSize: '1em' },
	draggable: false,
	connectable: false,
	deletable: false
}

const ComparisonFlow = () => {
	const selected: CompareNodes = useSelector(getCompareNodes);
	const relationshipStatus: ServiceStatus<RelationshipInfo | undefined> =
		useSelector(getRelationship);

	const src: Position = Position.Right;
	const dst: Position = Position.Left;

	const person1Label = selected.first ? selected.first.name : '?';
	const person2Label = selected.second ? selected.second.name : '?';
	const relationshipLabel =
		relationshipStatus.status === 'Success'
			? relationshipStatus.content!.relationship!.charAt(0).toUpperCase() +
			relationshipStatus.content!.relationship!.slice(1)
			: '?';

	const nodes: Node[] = [
		{
			...comparisonFlowNodeBase,
			id: 'person-1',
			sourcePosition: src,
			data: { label: person1Label },
			position: { x: 100, y: 0 },
			type: 'input'
		},
		{
			...comparisonFlowNodeBase,
			id: 'person-2',
			sourcePosition: src,
			data: { label: person2Label },
			position: { x: 100, y: 100 },
			type: 'input'
		},
		{
			...comparisonFlowNodeBase,
			id: 'relationship',
			targetPosition: dst,
			data: { label: relationshipLabel },
			position: { x: 400, y: 50 },
			type: 'output',
		}
	];

	const isAnimated = person1Label === '?' || person2Label === '?';
	const edges = [
		{
			id: '1',
			source: 'person-1',
			target: 'relationship',
			animated: isAnimated
		},
		{
			id: '2',
			source: 'person-2',
			target: 'relationship',
			animated: isAnimated
		}
	];

	return (
		<div className="comparison-flow">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				panOnDrag={false}
				panOnScroll={false}
				zoomOnScroll={false}
				zoomOnPinch={false}
				zoomOnDoubleClick={false}
				fitView
			></ReactFlow>
		</div>
	);
};

export default ComparisonFlow;
