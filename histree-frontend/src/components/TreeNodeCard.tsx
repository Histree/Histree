import React from "react";
import "./TreeNodeCard.scss";

const TreeNodeCard = (props: { displayName: string }) => {
  const { displayName } = props;
  return (
    <div className="treenodecard">
      <h3>{displayName}</h3>
    </div>
  );
};

export default TreeNodeCard;
