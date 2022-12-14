import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import React, { useState } from 'react';
import "./HelpDialog.scss"
import { HelpInformation } from './HelpInformation';

const HelpDialogTitle = (props: {
	onClose: () => void;
	children?: React.ReactNode;
}) => {
	const { onClose, children } = props;
	return (
		<div>
			<DialogTitle sx={{ paddingBottom: 0 }}>
				{children}
				<IconButton sx={{ position: 'absolute', top: "0.5em", right: "0.25em" }} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
		</div>
	);
};

export const HelpDialog = () => {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div className="help-dialog">
			<IconButton onClick={handleClickOpen}>
				<HelpIcon />
			</IconButton>
			<Dialog open={open} onClose={(e, r) => { handleClose() }}>
				<HelpDialogTitle onClose={handleClose}>
					<Typography variant="h5">
						How to use Histree
					</Typography>
				</HelpDialogTitle>
				<DialogContent>
					<HelpInformation />
				</DialogContent>
			</Dialog>
		</div>
	);
};
