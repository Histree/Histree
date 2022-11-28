import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import './ComparisonCard.scss';
import ComparisonFlow from './ComparisonFlow';
import { ReactFlowProvider } from 'reactflow';
import { useSelector } from 'react-redux';
import { getRenderContent } from '../../stores';

export const ComparisonCard = () => {
	const renderContent = useSelector(getRenderContent);
	return (
		<div className="comparison-container">
			<Card>
				<CardHeader style={{ padding: '1em 0 0 1em', margin: 0 }} title="Relationship Search" />
				{renderContent.status === 'Success' ?
					<CardContent>
						<div className="comparison-container-inner">
							<ReactFlowProvider>
								<ComparisonFlow />
							</ReactFlowProvider>
						</div>
					</CardContent> : <CardContent><p>No data detected. Please search for someone.</p></CardContent>}
			</Card>
		</div>
	);
};
