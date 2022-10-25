import { Drawer, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import "./TreeNodeCard.scss";

const TreeNodeCard = (props: { displayName: string }) => {
  const [expanded, setExpanded] = useState(false);

  const { displayName } = props;

  const expandWindow = () => {
    setExpanded(!expanded);
    console.log(`expanded: ${expanded}`);
  };

  return (
    <div className="treenodecard" onClick={expandWindow}>
      <Typography variant="body1">{displayName}</Typography>
      {expanded && (
        <Drawer
          hideBackdrop
          anchor="right"
          open={expanded}
          onClose={() => setExpanded(false)}
        >
          <Box className="treenodecard-modal">
            <Typography variant="h4">{displayName}</Typography>
          </Box>
        </Drawer>
      )}
    </div>
  );
};

export default TreeNodeCard;
