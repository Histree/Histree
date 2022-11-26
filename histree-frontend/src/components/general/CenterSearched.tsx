import React, { SyntheticEvent } from "react";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import './CenterSearched.scss'
import {
	getRenderContent,
	getRenderMode,
	setRenderMode
} from '../../stores';
import { MyLocation } from "@mui/icons-material";
import { useReactFlow } from "reactflow";

export const CenterSearched = () => {
	const renderContent = useSelector(getRenderContent)
	const { setCenter, getNode, getZoom } = useReactFlow();

	const handleCenterClick = () => {
		if (renderContent.status === 'Success') {
			const node = getNode(renderContent.content.searchedQid);
			if (node !== undefined) {
				setCenter(node?.position.x, node?.position.y, { duration: 800, zoom: getZoom() });
			}
		}
	}

	return renderContent.status === 'Success' ? <div className="center_on_searched_container">
		<Button variant="contained" onClick={() => handleCenterClick()} startIcon={<MyLocation />}>
			Center on searched
		</Button>
		{/* <IconButton onClick={handleCenterClick} style={{ height: '100%' }}>
			<Tooltip placement="top" title="Center on searched"><MyLoca/></Tooltip>
		</IconButton> */}
	</div > : <></>

};
