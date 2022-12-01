import {
	Typography
} from '@mui/material';
import React from 'react';
import "./HelpDialog.scss"
import { HelpInformation } from './HelpInformation';

export const FrontPageHelp = () => {
	return (
		<div>
			<Typography variant="h5">
				How to use Histree
			</Typography>
			<HelpInformation />
		</div>
	);
};
