import React, { useRef } from 'react';
import Flow from '../components/Flow';
import { getSelected, getRenderContent, getRenderMode, setSelected } from '../stores/base';
import { useDispatch, useSelector } from 'react-redux';
import { ComparisonCard, ModelIcons, DescriptorCard, SearchBar, HelpDialog, ChildrenFinderCard } from '../components';
import { ReactFlowProvider } from 'reactflow';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import { useOnClickOutside } from 'usehooks-ts';
import './TreePage.scss';
import { CenterSearched } from '../components/general/CenterSearched';
import '../components/TreeNode.scss'

const TreePage = () => {
	const selected = useSelector(getSelected);
	const renderContent = useSelector(getRenderContent);
	const renderMode = useSelector(getRenderMode);
	const expandedRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();

	const handleClickOutside = () => {
		dispatch(setSelected(undefined));
	};

	useOnClickOutside(expandedRef, handleClickOutside);

	return (
		<div className="treepage">
			<HelpDialog />

			<ReactFlowProvider>
				{renderContent.status === 'Success' && (
					<Flow content={renderContent.content!} />
				)}

				{renderContent.status === 'Loading' && (
					<Box
						sx={{
							display: 'flex',
							width: '100%',
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<CircularProgress />
					</Box>
				)}
				<Snackbar
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
					open={renderContent.status === 'Failure'}
					autoHideDuration={3000}
				>
					<Alert severity="error">
						Error Occured while searching, please try again
					</Alert>
				</Snackbar>
				<div className='topleft-container'>
					<ModelIcons />
					{renderMode === 'View' && <SearchBar />}
					{renderMode === 'Compare' && <ComparisonCard />}
					{renderMode === 'Children' && <ChildrenFinderCard />}
				</div>
				<CenterSearched />
				{selected !== undefined && <DescriptorCard ref={expandedRef} selectedItem={selected} />}
			</ReactFlowProvider>
		</div>
	);
};

export default TreePage;
