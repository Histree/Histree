import React, { useRef } from 'react';
import Flow from '../components/Flow';
import { getSelected, getRenderContent, getRenderMode, setSelected } from '../stores/base';
import { useDispatch, useSelector } from 'react-redux';
import {
	ComparisonCard,
	ModeIcons,
	DescriptorCard,
	SearchBar,
	HelpDialog,
	ChildrenFinderCard,
	FilterCard,
	Expander
} from '../components';
import { ReactFlowProvider } from 'reactflow';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import { useOnClickOutside } from 'usehooks-ts';
import { CenterSearched } from '../components/general/CenterSearched';
import '../components/TreeNode.scss'
import { FrontPageHelp } from '../components/help/FrontPageHelp';
import './TreePage.scss';
import { isContentAvail } from '../utils/utils';
import { DataFail, DataSuccess } from '../services';
import { RenderContent } from '../models';

const TreePage = () => {
	const selected = useSelector(getSelected);
	const renderContent = useSelector(getRenderContent);
	const renderMode = useSelector(getRenderMode);
	const expandedRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();

	const handleClickOutside = () => {
		dispatch(setSelected(undefined));
	};

	useOnClickOutside(expandedRef, handleClickOutside);

	return (
		<div className="treepage">
			{selected !== undefined && <>
				<DescriptorCard ref={expandedRef} selectedItem={selected} />
			</>}
			<HelpDialog />

			<ReactFlowProvider>
				{isContentAvail(renderContent) && (
					<Flow content={(renderContent as DataSuccess<RenderContent> | DataFail<RenderContent>).content!} />
				)}
				{renderContent.status === 'Initial' && (
					<Box
						sx={{
							display: 'flex',
							width: '100%',
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<FrontPageHelp />
					</Box>
				)}
				{(renderContent.status === 'Loading' || renderContent.status === 'Expanding') && (
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
						Error occurred while searching, please try again.
					</Alert>
				</Snackbar>
				<div className='topleft-container'>
					<ModeIcons />
					{renderMode === 'View' && <SearchBar />}
					{renderMode === 'Compare' && <ComparisonCard />}
					{renderMode === 'Children' && <ChildrenFinderCard />}
					{renderMode === 'Filter' && <FilterCard />}
				</div>
				<CenterSearched />
			</ReactFlowProvider>
		</div>
	);
};

export default TreePage;
