import React from "react";
import Flow from "../components/Flow";
import { getSelected } from "../stores/base";
import { useSelector } from "react-redux";
import "./TreePage.scss";
import { DescriptorCard, SearchBar } from "../components";
import { ReactFlowProvider } from "reactflow";
import { DepthBox } from "../components";

const TreePage = () => {
  const selected = useSelector(getSelected);
  console.log(selected);
  return (
    <div className="treepage">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>

      <DepthBox />
      <SearchBar />
      {selected !== undefined && <DescriptorCard selectedItem={selected} />}
    </div>
  );
};

export default TreePage;
