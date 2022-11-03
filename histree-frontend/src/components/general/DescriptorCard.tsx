import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, getSelected } from "../../stores/base";
import { Selected } from "../../models";
import "./DescriptorCard.scss";

export const DescriptorCard = (props: { selectedItem: Selected }) => {
  const { selectedItem } = props;

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
          title={selectedItem.name}
        />
        <CardContent>This person is {selectedItem.name}</CardContent>
        {selectedItem.image && <p>This should be an image</p>}
      </Card>
    </div>
  );
};
