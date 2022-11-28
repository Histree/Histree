import React, { SyntheticEvent } from "react";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import { Button, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import './ModeIcons.scss';
import {
	getRenderMode,
	setRenderMode
} from '../../stores';

export const ComparisonToggle = () => {
	const dispatch = useDispatch();
	const renderMode = useSelector(getRenderMode);

	return (
		<div className="comparison_toggle_container">
			<Tooltip placement="right" title="View and Search">
				<IconButton color={renderMode === 'View' ? 'info' : 'default'}
					onClick={() => dispatch(setRenderMode('View'))}
					className="sidebar_icon_button"
					style={{ padding: '0.4em 0.25em' }}>
					<VisibilityIcon />
				</IconButton>
			</Tooltip>
			<Tooltip placement="right" title="Find Relationship">
				<IconButton color={renderMode === 'Compare' ? 'info' : 'default'}
					onClick={() => dispatch(setRenderMode('Compare'))}
					style={{ padding: '0.4em 0.25em' }}>
					<CompareArrowsIcon />
				</IconButton>
			</Tooltip>
			<Tooltip placement="right" title="Find Children">
				<IconButton color={renderMode === 'Children' ? 'info' : 'default'}
					onClick={() => dispatch(setRenderMode('Children'))}
					style={{ padding: '0.4em 0.25em' }}>
					<PeopleIcon />
				</IconButton>
			</Tooltip>
		</div >
	);
}
