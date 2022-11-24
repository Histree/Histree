import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import './ComparisonCard.scss';
import ComparisonFlow from './ComparisonFlow';
import { ReactFlowProvider } from 'reactflow';

export const ComparisonCard = () => {
	return (
		<div className="comparison-container">
			<Card>
				<CardHeader style={{ padding: '1em 0 0 1em', margin: 0 }} title="Relationship Search" />
				<CardContent>
					<div className="comparison-container-inner">
						<ReactFlowProvider>
							<ComparisonFlow />
						</ReactFlowProvider>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
