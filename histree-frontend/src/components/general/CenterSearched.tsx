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
import { isContentAvail } from "../../utils/utils";
import { DataFail, DataSuccess } from "../../services";
import { RenderContent } from "../../models";

export const CenterSearched = () => {
	const renderContent = useSelector(getRenderContent)
	const { setCenter, getNode, getZoom } = useReactFlow();

	const handleCenterClick = () => {
		if (isContentAvail(renderContent)) {
			const centerId = (renderContent as DataSuccess<RenderContent> | DataFail<RenderContent>).content?.searchedQid;
			if (centerId !== undefined) {
				const node = getNode(centerId);
				if (node !== undefined) {
					setCenter(node?.position.x, node?.position.y, { duration: 800, zoom: getZoom() });
				}
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
