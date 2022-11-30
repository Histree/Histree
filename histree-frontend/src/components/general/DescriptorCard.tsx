import CloseIcon from '@mui/icons-material/Close';
import React, { forwardRef } from 'react';
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	IconButton,
	Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, getSelected } from '../../stores/base';
import { Selected } from '../../models';
import './DescriptorCard.scss';
import { Expander } from '.';

interface DescriptorCardProps {
	children?: React.ReactNode;
	selectedItem: Selected;
}

export const DescriptorCard = forwardRef<HTMLDivElement, DescriptorCardProps>(
	(props, ref) => {
		const { selectedItem } = props;

		const dispatch = useDispatch();

		const closeWindow = () => {
			dispatch(setSelected(undefined));
		};

		return (
			<div ref={ref}>
				<Expander />
				<div className="descriptor-container">

					<Card
						className="descriptor-card"
						style={{ height: '100%', overflowY: 'scroll' }}
						variant="outlined"
					>
						{selectedItem.attributes &&
							selectedItem.attributes!['image'] &&
							selectedItem.attributes!['image'] !== 'undefined' && (
								<CardMedia
									className="descriptor-card-media"
									component="img"
									height="350"
									image={selectedItem.attributes!['image']}
									alt={selectedItem.attributes!['image']}
								/>
							)}

						<CardHeader
							action={
								<IconButton
									onClick={closeWindow}
									aria-label="close">
									<CloseIcon></CloseIcon>
								</IconButton>
							}
							title={selectedItem.name}
							subheader={selectedItem.description &&
								selectedItem.description !== 'undefined' ? (
								<Typography variant="body2" color="text.secondary">
									{selectedItem.description.charAt(0).toUpperCase() +
										selectedItem.description.slice(1)}
								</Typography>
							) : (
								<Typography variant="body2" color="text.secondary">
									Description not available.
								</Typography>
							)}
						/>

						<CardContent>
							<Box className="descriptor-container-body">

								{selectedItem.attributes &&
									Object.keys(selectedItem.attributes)
										.filter((att) => {
											return (
												selectedItem.attributes![att] !== 'undefined' &&
												att !== 'image'
											);
										})
										.map((att) => {
											const attrName = att.charAt(0).toUpperCase() + att.slice(1);
											const attrVal = selectedItem.attributes![att];
											var attrDesc = ''

											if (attrVal === 'undefined') {
												attrDesc = 'Unknown'
											} else if (typeof attrVal === 'object') {
												// For locations: when att = 'place_of_birth' or 'place_of_death'
												// and contains sub-JSONs
												attrDesc = attrVal['name'];
											} else {
												attrDesc = attrVal.charAt(0).toUpperCase() + attrVal.slice(1);
											}

											return (
												<Typography key={att} variant="body2">
													<b>{attrName.replace(/_/g, ' ')}:</b> {attrDesc}
												</Typography>
											);
										})}
							</Box>
						</CardContent>
						<CardActions>
							<Button href={selectedItem.article} target="_blank">Learn More</Button>
						</CardActions>

					</Card>
				</div>
			</div>
		);
	}
);
