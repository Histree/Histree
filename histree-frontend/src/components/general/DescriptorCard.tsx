import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	IconButton,
	Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, getSelected } from "../../stores/base";
import { Selected } from "../../models";
import "./DescriptorCard.scss";

export const DescriptorCard = (props: { selectedItem: Selected }) => {
	const { selectedItem } = props;

	console.log(selectedItem);

	const dispatch = useDispatch();
	const selected = useSelector(getSelected);

	const closeWindow = () => {
		dispatch(setSelected(undefined));
		console.log(selected);
	};

	return (
		<div className="descriptor-container">
			<Card
				className="descriptor-card"
				style={{ height: "100%", overflowY: "scroll" }}
				variant="outlined"
			>
				{selectedItem.image && (
					<CardMedia
						component="img"
						height="200"
						image={selectedItem.image}
						alt={selectedItem.name}
					/>
				)}

				<CardHeader
					onClick={closeWindow}
					action={
						<IconButton aria-label="close">
							<CloseIcon></CloseIcon>
						</IconButton>
					}
					title={selectedItem.name}
				/>

				<CardContent>
					<Box className="descriptor-container-body">
						{selectedItem.attributes &&
							Object.keys(selectedItem.attributes).map((att) => {
								return (
									<Typography key={att} variant="body2">
										{`${att}: ${selectedItem.attributes![att]}`}
									</Typography>
								);
							})}
						<br />
						{selectedItem.description && (
							<Typography variant="body2">
								{selectedItem.description}
							</Typography>
						)}
					</Box>
				</CardContent>
				<CardActions>
					<>
						{selectedItem.links &&
							Object.keys(selectedItem.links).map((linkName) => {
								return (
									<Button key={linkName} size="small" href={selectedItem.links![linkName]}>
										{linkName}
									</Button>
								);
							})}
					</>
				</CardActions>
			</Card>
		</div>
	);
};
