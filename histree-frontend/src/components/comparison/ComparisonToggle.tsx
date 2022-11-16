import React, { SyntheticEvent } from "react";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import './ComparisonToggle.scss';
import {
	getRenderMode,
	setRenderMode
} from '../../stores';

export const ComparisonToggle = () => {
	const dispatch = useDispatch();
	const renderMode = useSelector(getRenderMode);

	const handleToggle = (e: SyntheticEvent) => {
		if (renderMode === 'View') {
			dispatch(setRenderMode('Compare'))
		} else {
			dispatch(setRenderMode('View'))
		}
	};
	return (
		<div className="comparison_toggle_container">
			<IconButton onClick={handleToggle} style={{ height: '100%' }}>
				{renderMode === 'View' ?
					<Tooltip placement="top" title="Switch to Compare Mode"><CompareArrowsIcon /></Tooltip> :
					<Tooltip placement="top" title="Switch to View Mode"><VisibilityIcon /></Tooltip>}
			</IconButton>
		</div >
	);
};
