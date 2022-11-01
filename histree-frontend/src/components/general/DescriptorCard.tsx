import { Drawer, Box, Typography, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, getSelected } from "../../stores/base";
import "./DescriptorCard.scss";
import { SelectedPerson } from "../../models";

const DescriptorCard = (props: { selectedPerson: SelectedPerson }) => {
	const dispatch = useDispatch();
	const selected = useSelector(getSelected);

	const closeWindow = () => {
		dispatch(setSelected(undefined));
		console.log(selected);
	};

	return (
		<div className="descriptor_container">
			<Card style={{ height: "100%" }} variant="outlined">
				<CardHeader
					onClick={closeWindow}
					action={
						<IconButton aria-label="close">
							<CloseIcon></CloseIcon>
						</IconButton>
					}
					title={props.selectedPerson.name}
				/>
				<CardContent>
					This person is {props.selectedPerson.name}
				</CardContent>
				{props.selectedPerson.image && <p>This should be an image</p>}
			</Card>
		</div>
	);
};

export default DescriptorCard;