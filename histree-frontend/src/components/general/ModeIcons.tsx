import React from "react";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import TuneIcon from '@mui/icons-material/Tune';
import { IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import './ModeIcons.scss';
import {
	getRenderMode,
	setRenderMode
} from '../../stores';
import { RenderMode } from "../../models";

export const ModeIcons = () => {
	const dispatch = useDispatch();
	const renderMode = useSelector(getRenderMode);

	const handleIconClick = (mode: RenderMode) => {
		dispatch(setRenderMode(mode));
	}

	return (
		<div className="model_icons_container">
			<Tooltip placement="right" title="View and Search">
				<IconButton color={renderMode === 'View' ? 'info' : 'default'}
					onClick={() => handleIconClick('View')}
					className="sidebar_icon_button"
					style={{ padding: '0.4em 0.25em' }}>
					<VisibilityIcon />
				</IconButton>
			</Tooltip>
			<Tooltip placement="right" title="Find Relationship">
				<IconButton color={renderMode === 'Compare' ? 'info' : 'default'}
					onClick={() => handleIconClick('Compare')}
					style={{ padding: '0.4em 0.25em' }}>
					<CompareArrowsIcon />
				</IconButton>
			</Tooltip>
			<Tooltip placement="right" title="Find Children">
				<IconButton color={renderMode === 'Children' ? 'info' : 'default'}
					onClick={() => handleIconClick('Children')}
					style={{ padding: '0.4em 0.25em' }}>
					<PeopleIcon />
				</IconButton>
			</Tooltip>
			<Tooltip placement="right" title="Filter">
				<IconButton color={renderMode === 'Filter' ? 'info' : 'default'}
					onClick={() => handleIconClick('Filter')}
					style={{ padding: '0.4em 0.25em' }}>
					<TuneIcon />
				</IconButton>
			</Tooltip>
		</div >
	);
}
