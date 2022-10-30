import { Drawer, Box, Typography, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, getSelected } from "../../stores/base";
import "./DescriptorCard.scss";

const DescriptorCard = (props: { displayName: string }) => {
	const dispatch = useDispatch();
	const selected = useSelector(getSelected);
	const { displayName } = props;

	const expandWindow = () => {
		dispatch(setSelected({ name: displayName, }));
		console.log(selected);
	};

	return (
		<div className="descriptor_container">
			<Card variant="outlined">
				<CardHeader
					action={
						<IconButton aria-label="close">
							<CloseIcon></CloseIcon>
						</IconButton>
					}
					title="Shrimp and Chorizo Paella"
					subheader="September 14, 2016"
				/>
				<CardContent>
					{displayName}
				</CardContent>
			</Card>
		</div>
	);
};

export default DescriptorCard;
