import { Drawer, Box, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, getSelected } from "../stores/base";
import { mockAttributes, mockDescription, mockImg, mockLinks } from "../models";
import "./TreeNodeCard.scss";

const TreeNodeCard = (props: { displayName: string }) => {
  const dispatch = useDispatch();
  const selected = useSelector(getSelected);
  const { displayName } = props;

  const expandWindow = () => {
    dispatch(
      setSelected({
        name: displayName,
        image: mockImg,
        attributes: mockAttributes,
        description: mockDescription,
        links: mockLinks,
      })
    );
    console.log(selected);
  };

  return (
    <div className="treenodecard" onClick={expandWindow}>
      <Typography variant="body1">{displayName}</Typography>
    </div>
  );
};

export default TreeNodeCard;
