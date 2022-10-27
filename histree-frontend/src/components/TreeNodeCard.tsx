import { Drawer, Box, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { setSelected } from "../stores/base";
import "./TreeNodeCard.scss";

const TreeNodeCard = (props: { displayName: string }) => {
	const dispatch = useDispatch();
	const { displayName } = props;

	const expandWindow = () => {
		dispatch(setSelected({ name: displayName, }));
		console.log(`expanded: ${displayName}`);
	};

	return (
		<div className="treenodecard" onClick={expandWindow}>
			<Typography variant="body1">{displayName}</Typography>
		</div>
	);
};

export default TreeNodeCard;
