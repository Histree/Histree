import React from "react";
import Flow from "../components/Flow";
import { Drawer, Box, Typography } from "@mui/material";
import { getSelected, setSelected } from "../stores/base";
import { useSelector, useDispatch } from 'react-redux';
import "./TreePage.scss";
import DescriptorCard from "../components/general/DescriptorCard";

const TreePage = () => {
	const selected = useSelector(getSelected);
	console.log(selected);
	return (
		<div className="treepage">
			<Flow />
			{selected !== undefined && (
				<DescriptorCard selectedPerson={selected} />
			)}
		</div>
	);
};

export default TreePage;