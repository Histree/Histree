import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
} from "@mui/material";
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

        <CardContent>This person is {selectedItem.name}</CardContent>
      </Card>
    </div>
  );
};
