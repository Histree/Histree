import {
	Box,
	Stack,
	Typography
} from '@mui/material';
import React from 'react';
import "./HelpDialog.scss"
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import TuneIcon from '@mui/icons-material/Tune';

export const HelpInformation = () => {
	return (
		<div>
			<Typography>Use the left sidebar to navigate between modes.</Typography>
			<br />
			<Stack direction="row" alignItems="center" gap={1}>
				<VisibilityIcon />
				<Typography sx={{ fontWeight: 700 }}>Searching and viewing</Typography>
			</Stack>
			<Typography>Search for a person you want to explore their relationships of.</Typography>
			<Typography>Click on nodes to find out more about the person.</Typography>
			<br />
			<Stack direction="row" alignItems="center" gap={1}>
				<CompareArrowsIcon />
				<Typography sx={{ fontWeight: 700 }}>Comparing two people</Typography>
			</Stack>
			<Stack direction="row" alignItems="center" gap={1}>
				<Typography>Click on the</Typography>
				<CompareArrowsIcon />
				<Typography>button to switch to Compare Mode.</Typography>
			</Stack>
			<Typography>Find the common ancestor between two relatives by clicking on two nodes.</Typography>
			<br />
			<Stack direction="row" alignItems="center" gap={1}>
				<PeopleIcon />
				<Typography sx={{ fontWeight: 700 }}>Finding children</Typography>
			</Stack>
			<Stack direction="row" alignItems="center" gap={1}>
				<Typography>Click on the</Typography>
				<PeopleIcon />
				<Typography>button to switch to Children Finder Mode.</Typography>
			</Stack>
			<Typography>Find the children of two people if they have had any.</Typography>
			<br />
			<Stack direction="row" alignItems="center" gap={1}>
				<TuneIcon />
				<Typography sx={{ fontWeight: 700 }}>Filtering</Typography>
			</Stack>
			<Stack direction="row" alignItems="center" gap={1}>
				<Typography>Click on the</Typography>
				<TuneIcon />
				<Typography>button to view Filters.</Typography>
			</Stack>
			<Typography>Select the attributes you want to filter by.</Typography>
		</div>
	);
};
