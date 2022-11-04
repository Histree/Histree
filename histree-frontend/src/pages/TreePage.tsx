import React from "react";
import Flow from "../components/Flow";
import { getSelected, getRenderContent } from "../stores/base";
import { useSelector } from "react-redux";
import "./TreePage.scss";
import { DescriptorCard, SearchBar } from "../components";
import { ReactFlowProvider } from "reactflow";
import { DepthBox } from "../components";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";

const TreePage = () => {
	const selected = useSelector(getSelected);
	const renderContent = useSelector(getRenderContent);
	return (
		<div className="treepage">
			{renderContent.status === "Success" && (
				<ReactFlowProvider>
					<Flow content={renderContent.content!} />
				</ReactFlowProvider>
			)}
			{renderContent.status === "Loading" &&
				<Box sx={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
					<CircularProgress />
				</Box>}
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				open={renderContent.status === "Failure"}
				autoHideDuration={3000}
			>
				<Alert severity="error">
					Error Occured while searching, please try again
				</Alert>
			</Snackbar>
			<DepthBox />
			<SearchBar />
			{selected !== undefined && <DescriptorCard selectedItem={selected} />}
		</div>
	);
};

export default TreePage;
