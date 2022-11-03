import React from "react";
import Flow from "../components/Flow";
import { getSelected, getRenderContent, } from "../stores/base";
import { useSelector } from 'react-redux';
import "./TreePage.scss";
import { DescriptorCard, SearchBar } from "../components";
import { ReactFlowProvider } from "reactflow";
import { DepthBox } from "../components";

const TreePage = () => {
	const selected = useSelector(getSelected);
	const renderContent = useSelector(getRenderContent);
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
