import React from 'react';
import { useSelector } from 'react-redux';
import ReactFlow, { Position, Node } from 'reactflow';
import { RelationshipInfo } from '../../models';
import { CompareNodes } from '../../models/compareInfo';
import { ServiceStatus } from '../../services';
import { getCompareNodes, getRelationship, getRenderContent } from '../../stores';
import './ChildrenFinderFlow.scss';

const childrenFinderFlowNodeBase: Partial<Node> = {
	style: { fontSize: '1em' },
	draggable: false,
	connectable: false,
	deletable: false
}

const ChildrenFinderFlow = () => {
	const selected: CompareNodes = useSelector(getCompareNodes);
	const relationshipStatus: ServiceStatus<RelationshipInfo | undefined> =
		useSelector(getRelationship);

	const src: Position = Position.Right;

	const person1Label = selected.first ? selected.first.name : '?';
	const person2Label = selected.second ? selected.second.name : '?';
	const relationshipLabel =
		relationshipStatus.status === 'Success'
			? relationshipStatus.content!.relationship!.charAt(0).toUpperCase() +
			relationshipStatus.content!.relationship!.slice(1)
			: '?';

	const nodes: Node[] = [
		{
			...childrenFinderFlowNodeBase,
			id: 'person-1',
			data: { label: person1Label },
			position: { x: 100, y: 0 },
			type: 'input'
		},
		{
			...childrenFinderFlowNodeBase,
			id: 'person-2',
			data: { label: person2Label },
			position: { x: 300, y: 0 },
			type: 'input'
		},
	];

	const isAnimated = person1Label === '?' || person2Label === '?';

	return (
		<div className="comparison-flow">
			<ReactFlow
				nodes={nodes}
				edges={[]}
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

export default ChildrenFinderFlow;
