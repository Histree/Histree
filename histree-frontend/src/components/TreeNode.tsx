import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setSelected,
	getSelected,
	getRenderContent,
	getNodeLookup,
	setNodeLookup,
	AppDispatch,
	setNodeLookupDown,
	setNodeLookupUp
} from '../stores/base';
import { HandleStatus, NodeInfo } from '../models';
import './TreeNode.scss';
import { Handle, Position } from 'reactflow';
import { fetchSelectedExpansion } from '../services';

const nodeClassMap: Record<HandleStatus, string> = {
	Loading: 'handle_loading',
	Complete: 'handle_complete',
	NoData: 'handle_nodata',
	None: 'handle'
}

const TreeNode = ({ data }: { data: NodeInfo }) => {
	const dispatch = useDispatch();
	const selected = useSelector(getSelected);
	const renderContent = useSelector(getRenderContent);
	const nodeLookup = useSelector(getNodeLookup);
	const appDispatch = useDispatch<AppDispatch>();

	const expandWindow = () => {
		dispatch(
			setSelected({
				name: data.name,
				image: data?.image,
				attributes: data.petals,
				description: data?.description
				// links: details?.links,
			})
		);
		console.log(selected);
	};

	const handleExpandParents = (): void => {
		dispatch(setNodeLookupUp({ searchedQid: data.id, status: 'Loading' }))
		if (renderContent.status === 'Success') {
			const { branches } = renderContent.content!;
			const nodes = { ...nodeLookup };

			if (!nodes[data.id].searched) {
				appDispatch(
					fetchSelectedExpansion({ searchedQid: data.id, direction: 'up' })
				);
			} else if (branches[data.id]) {
				Object.keys(branches).forEach((parentId) => {
					if (branches[parentId].includes(data.id)) {
						const parent = { ...nodes[parentId] };
						parent.visible = true;
						nodes[parentId] = parent;
					}
				});

				dispatch(setNodeLookup(nodes));
				dispatch(setNodeLookupUp({ searchedQid: data.id, status: 'Complete' }))
			} else {
				// TODO: Do something if no parent data exists
			}
		}
	};

	const handleExpandChildren = (): void => {
		dispatch(setNodeLookupDown({ searchedQid: data.id, status: 'Loading' }))
		if (renderContent.status === 'Success') {
			const { branches } = renderContent.content!;
			const nodes = { ...nodeLookup };

			if (!nodes[data.id].searched) {
				appDispatch(
					fetchSelectedExpansion({ searchedQid: data.id, direction: 'down' })
				);
			} else if (branches[data.id]) {
				branches[data.id].forEach((childId) => {
					console.log(nodes[childId]);
					const child = { ...nodes[childId] };
					child.visible = true;
					nodes[childId] = child;
				});
				dispatch(setNodeLookup(nodes));
				dispatch(setNodeLookupDown({ searchedQid: data.id, status: 'Complete' }))
			} else {
				// TODO: Do something if no children data exists
			}
		}
	};

	return (
		<>
			<Handle
				className={nodeClassMap[nodeLookup[data.id].upExpanded]}
				type="target"
				position={Position.Top}
				isConnectable
				onClick={handleExpandParents}
			/>
			<div className="treenodecard" onClick={expandWindow}>
				<div className="treenodechild">{data.name}</div>
			</div>

			<Handle
				className={nodeClassMap[nodeLookup[data.id].downExpanded]}
				type="source"
				position={Position.Bottom}
				isConnectable
				onClick={handleExpandChildren}
			/>
		</>
	);
};

export default TreeNode;
