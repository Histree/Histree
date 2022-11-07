import { Drawer, Box, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, getSelected } from "../stores/base";
import { NodeInfo } from "../models";
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
			<div className="treenodecard" onClick={expandWindow}>
				<Handle
					type="target"
					position={Position.Top}
				/>
				<div className="treenodechild">
					{data.name}
				</div>
				<Handle
					type="source"
					position={Position.Bottom}
				/>
			</div>
		</>
	);
};

export default TreeNode;
