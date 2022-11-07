import { Drawer, Box, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, getSelected } from "../stores/base";
import { mockAttributes, mockDescription, mockImg, mockLinks, NodeInfo } from "../models";
import "./TreeNode.scss";
import { Handle, Position } from "reactflow";

const TreeNode = ({ data }: { data: NodeInfo }) => {
	const dispatch = useDispatch();
	const selected = useSelector(getSelected);

	const expandWindow = () => {
		dispatch(
			setSelected({
				name: data.name,
				image: data?.image,
				attributes: data.petals,
				description: data?.description,
				// links: details?.links,
			})
		);
		console.log(selected);
	};

	return (
		<>
			<Handle
				type="target"
				position={Position.Top}
			/>
			<div className="treenodecard" onClick={expandWindow}>
				{data.name}
			</div>
			<Handle
				type="target"
				position={Position.Bottom}
			/>
		</>
	);
};

export default TreeNode;
