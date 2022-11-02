import React from "react";
import Flow from "../components/Flow";
import { Drawer, Box, Typography } from "@mui/material";
import { getSelected, setSelected, getRenderContent, setRenderContent } from "../stores/base";
import { useSelector, useDispatch } from 'react-redux';
import "./TreePage.scss";
import { DescriptorCard, SearchBar } from "../components";
import { ReactFlowProvider } from "reactflow";
import { DepthBox } from "../components";

const TreePage = () => {
	const selected = useSelector(getSelected);
	const renderContent = useSelector(getRenderContent);
	const dispatch = useDispatch();
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
			{selected !== undefined && (
				<DescriptorCard selectedPerson={selected} />
			)}
		</div>
	);
};

export default TreePage;
