import {
	Typography
} from '@mui/material';
import React from 'react';
import "./HelpDialog.scss"
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
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
