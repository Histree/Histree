import React, { forwardRef, SyntheticEvent } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import './Expander.scss'
import {
	AppDispatch,
	getNodeLookup,
	getRenderContent, getSelected, setResultServiceState, setSearchValue, setSelected,
} from '../../stores';
import { MyLocation } from "@mui/icons-material";
import { DataSuccess, fetchSelectedExpansion } from "../../services";
import { RenderContent, Selected } from "../../models";
import { render } from "react-dom";

export const Expander = () => {
	const renderContent = useSelector(getRenderContent);
	const selected = useSelector(getSelected) as Selected;
	const nodeLookup = useSelector(getNodeLookup);
	const dispatch = useDispatch();
	const appDispatch = useDispatch<AppDispatch>();

	const handleClick = () => {
		const successContent = renderContent as DataSuccess<RenderContent>;
		if (selected !== undefined && successContent.content !== undefined) {
			dispatch(setSelected(undefined));
			dispatch(setSearchValue(selected.name));
			dispatch(setResultServiceState({ ...successContent, status: 'Expanding' }));
			appDispatch(fetchSelectedExpansion({ qid: selected.id, name: selected.name }));
		}
	}

	return renderContent.status === 'Success' && !nodeLookup[selected.id].searched ?
		<div className="expander_container">
			<Button variant="contained" onClick={handleClick} startIcon={<MyLocation />}>
				Expand
			</Button>
		</div > : <></>

};
