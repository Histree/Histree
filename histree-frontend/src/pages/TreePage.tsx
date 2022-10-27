import React from "react";
import Flow from "../components/Flow";
import { Drawer, Box, Typography } from "@mui/material";
import { getSelected, setSelected } from "../stores/base";
import { useSelector, useDispatch } from 'react-redux';
import "./TreePage.scss";

const TreePage = () => {
	const selected = useSelector(getSelected);
	const dispatch = useDispatch();
	console.log(selected);
	return (
		<div className="treepage">
			<Flow />
			{selected !== undefined && (
				<Drawer
					hideBackdrop
					anchor="right"
					open={selected !== undefined}
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
