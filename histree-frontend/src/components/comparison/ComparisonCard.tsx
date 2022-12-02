import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import './ComparisonCard.scss';
import ComparisonFlow from './ComparisonFlow';
import { ReactFlowProvider } from 'reactflow';
import { useSelector } from 'react-redux';
import { getRenderContent } from '../../stores';
import { isContentAvail } from '../../utils/utils';

export const ComparisonCard = () => {
	const renderContent = useSelector(getRenderContent);
	return (
		<div className="comparison-container">
			<Card>
				<CardHeader style={{ padding: '1em 0 0 1em', margin: 0 }} title="Relationship Search" />
				{isContentAvail(renderContent) ?
					<CardContent>
						<div className="comparison-container-inner">
							<ReactFlowProvider>
								<ComparisonFlow />
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
