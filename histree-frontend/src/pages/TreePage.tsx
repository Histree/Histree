import React from "react";
import Flow from "../components/Flow";
import { getSelected, setSelected } from "../stores/base";
import { useSelector, useDispatch } from 'react-redux';
import "./TreePage.scss";
import { DescriptorCard, SearchBar } from "../components";
import { ReactFlowProvider } from "reactflow";

const TreePage = () => {
	const selected = useSelector(getSelected);
	console.log(selected);
	return (
		<div className="treepage">
			<ReactFlowProvider>
				<Flow />
			</ReactFlowProvider>

			<SearchBar />
			{selected !== undefined && (
				<DescriptorCard selectedPerson={selected} />
			)}
		</div>
	);
};

export default TreePage;
