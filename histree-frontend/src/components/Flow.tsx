import React from "react";
import ReactFlow, { Controls, Background, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import TreeNodeCard from "./TreeNodeCard";

const mockNodes: Node[] = [
	{
		id: "1",
		position: { x: 400, y: 400 },
		data: { label: <TreeNodeCard displayName="Prince Albert" /> },
		type: "input",
	},
	{
		id: "2",
		position: { x: 600, y: 400 },
		data: { label: <TreeNodeCard displayName="Queen Victoria" /> },
		type: "default",
	},
	{
		id: "3",
		position: { x: 500, y: 200 },
		data: { label: <TreeNodeCard displayName="Prince Edward" /> },
		type: "input",
	},
	{
		id: "4",
		position: { x: 700, y: 200 },
		data: { label: <TreeNodeCard displayName="Princess Victoria" /> },
		type: "input",
	},
	{
		id: "5",
		position: { x: 300, y: 600 },
		data: { label: <TreeNodeCard displayName="Princess Alice" /> },
		type: "output",
	},
	{
		id: "6",
		position: { x: 500, y: 600 },
		data: { label: <TreeNodeCard displayName="Prince Alfred" /> },
		type: "output",
	},
	{
		id: "7",
		position: { x: 700, y: 600 },
		data: { label: <TreeNodeCard displayName="Princess Helena" /> },
		type: "output",
	},
];

const mockEdges: Edge[] = [
	{
		id: "e3-2",
		source: "3",
		target: "2",
		type: "step",
	},
	{
		id: "e4-2",
		source: "4",
		target: "2",
		type: "step",
	},
	{
		id: "e1-5",
		source: "1",
		target: "5",
		type: "step",
	},
	{
		id: "e1-6",
		source: "1",
		target: "6",
		type: "step",
	},
	{
		id: "e1-7",
		source: "1",
		target: "7",
		type: "step",
	},
	{
		id: "e2-5",
		source: "2",
		target: "5",
		type: "step",
	},
	{
		id: "e2-6",
		source: "2",
		target: "6",
		type: "step",
	},
	{
		id: "e2-7",
		source: "2",
		target: "7",
		type: "step",
	},
];

const Flow = () => {
	return (
		<div style={{ height: "100%" }}>
			<ReactFlow nodes={mockNodes} edges={mockEdges} onNodeClick={(e) => console.log(e.target)}>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default Flow;
