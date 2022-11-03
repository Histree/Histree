import React from "react";
import Flow from "../components/Flow";
import { Drawer, Box, Typography } from "@mui/material";
import { getSelected, setSelected, getRenderContent, setRenderContent, AppDispatch } from "../stores/base";
import { useSelector, useDispatch } from 'react-redux';
import "./TreePage.scss";
import { DescriptorCard, SearchBar } from "../components";
import { ReactFlowProvider } from "reactflow";
import { DepthBox } from "../components";
import { fetchSearchSuggestions } from "../services";

const TreePage = () => {
	const selected = useSelector(getSelected);
	const renderContent = useSelector(getRenderContent);
	const dispatch = useDispatch<AppDispatch>();
	console.log(dispatch(fetchSearchSuggestions('Elizabeth')));
	console.log(selected);
	return (
		<div className="treepage">
			{!!renderContent &&
				<ReactFlowProvider>
					<Flow />
				</ReactFlowProvider>
			}

			<DepthBox />
			<SearchBar />
			{selected !== undefined && <DescriptorCard selectedItem={selected} />}
		</div>
	);
};

export default TreePage;
