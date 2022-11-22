import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import "./HelpDialog.scss"

const HelpDialogTitle = (props: {
  onClose: () => void;
  children?: React.ReactNode;
}) => {
  const { onClose, children } = props;
  return (
    <DialogTitle>
      {children}
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export const HelpDialog = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="help-dialog">
      <Button onClick={handleClickOpen} variant="outlined">Help</Button>
      <Dialog open={open}>
        <HelpDialogTitle onClose={handleClose}>
          How to use Histree
        </HelpDialogTitle>
        <DialogContent>
          <Typography>Here is how to use our app.</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};
