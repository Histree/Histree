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
	IconButtonProps,
	Typography,
	Link
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, getSelected } from '../../stores/base';
import { CardLocation, Selected } from '../../models';
import './DescriptorCard.scss';
import { Expander } from '.';
import { styled } from '@mui/material/styles';
import { mapsURL } from '../../utils/utils';





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

		const displayLocationURL = (name: string) => {
			if (selectedItem.attributes &&
				selectedItem.attributes[name] &&
				selectedItem.attributes[name] !== undefined
			) {
				const location = selectedItem.attributes[name] as unknown as CardLocation
				if (location.coordinate_location !== undefined) {
					return <Link href={mapsURL(location)} target="_blank">{location.name}</Link>;
				}

			}
			return (<Typography>No data found</Typography>);

		}

		const renderCardInfo = (att: string, attrName: string, attrVal: any, attrDesc: string) => {
			if (attrVal === 'undefined') {
				return <></>
			} else if (typeof attrVal === 'object') {
				// For locations: when att = 'place_of_birth' or 'place_of_death', containing sub-JSONs
				//attrDesc = attrVal['name'];
				return (
					<div style={{ display: 'flex' }}>
						<Typography key={att} variant="body2">
							<b>{attrName.replace(/_/g, ' ')}:</b>
						</Typography>
						&nbsp;
						{displayLocationURL(att)}
					</div>
				);
			} else {
				return (
					<Typography key={att} variant="body2">
						<b>{attrName.replace(/_/g, ' ')}:</b> {attrDesc}
					</Typography>
				);
			}
		}

		return (
			<div ref={ref} >
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
												attrDesc = attrVal['name'];
											} else {
												attrDesc = attrVal.charAt(0).toUpperCase() + attrVal.slice(1);
											}

											return renderCardInfo(att, attrName, attrVal, attrDesc);

										})}

							</Box>
						</CardContent>
						<CardActions>
							<Button href={selectedItem.article} target="_blank">Learn More</Button>
						</CardActions>
						<CardActions>
							<>
								{selectedItem.links &&
									Object.keys(selectedItem.links).map((linkName) => {
										return (
											<Button
												key={linkName}
												size="small"
												href={selectedItem.links![linkName]}
											>
												{linkName}
											</Button>
										);
									})}
							</>
						</CardActions>
					</Card>
				</div>
			</div>
		);
	}
);
