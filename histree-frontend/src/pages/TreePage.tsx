import React from "react";
import Flow from "../components/Flow";
import { Drawer, Box, Typography } from "@mui/material";
import { getSelected, setSelected, getRenderContent, setRenderContent } from "../stores/base";
import { useSelector, useDispatch } from 'react-redux';
import "./TreePage.scss";

const TreePage = () => {
	const selected = useSelector(getSelected);
	const renderContent = useSelector(getRenderContent);
	const dispatch = useDispatch();
	console.log(selected);
	return (
		<div className="treepage">
			{!!renderContent && <Flow />}
			{!!selected && (
				<Drawer
					hideBackdrop
					anchor="right"
					open={!!selected}
					onClose={() => dispatch(setSelected(undefined))}
				>
					<Box className="treenodecard-modal">
						<Typography variant="h4">{selected.name}</Typography>
					</Box>
				</Drawer>
			)}
		</div>
	);
};

export default TreePage;
