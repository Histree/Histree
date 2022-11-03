import { TextField } from "@mui/material";
import React, { SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDepth, getDepth } from "../../stores/base";
import "./DepthBox.scss";

export const DepthBox = () => {
  const dispatch = useDispatch();
  const depth = useSelector(getDepth);

  const handleSetDepth = (e: SyntheticEvent) => {
    dispatch(setDepth(+(e.target as HTMLInputElement).value));
  };

  return (
    <div className="depth-box-container">
      <TextField
        className="depth-box-text"
        defaultValue={depth}
        variant="outlined"
        type="number"
        label="Tree Depth"
        fullWidth
        onChange={(e) => handleSetDepth(e)}
      />
    </div>
  );
};
