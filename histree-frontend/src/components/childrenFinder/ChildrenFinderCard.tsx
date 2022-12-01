import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getRenderContent } from '../../stores';
import { ReactFlowProvider } from 'reactflow';
import ChildrenFinderFlow from './ChildrenFinderFlow';
import './ChildrenFinderCard.scss';

export const ChildrenFinderCard = () => {
	const renderContent = useSelector(getRenderContent);
	return (
		<div className="comparison-container">
			<Card>
				<CardHeader style={{ padding: '1em 0 0 1em', margin: 0 }} title="Children Search" />
				{renderContent.status === 'Success' ?
					<CardContent>
						<div className="comparison-container-inner">
							<ReactFlowProvider>
								<ChildrenFinderFlow />
							</ReactFlowProvider>
						</div>
					</CardContent> :
					<CardContent>
						<Typography>No data detected. Please search for someone.</Typography>
					</CardContent>}
			</Card>
		</div>
	);
};
