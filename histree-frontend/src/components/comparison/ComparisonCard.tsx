import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { TextField, Autocomplete, Card, CardHeader, CardContent, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from 'lodash';
import './ComparisonCard.scss';
import {
	AppDispatch,
	getCompareNodes,
	getSearchSuggestions,
	resetSearch,
	setResultServiceState
} from '../../stores';
import { fetchSearchResults, fetchSearchSuggestions } from '../../services';
import { CompareNodes } from "../../models/compareInfo";

export const ComparisonCard = () => {
	const dispatch = useDispatch();
	const selectedNodes: CompareNodes = useSelector(getCompareNodes);
	const searchSuggestions = useSelector(getSearchSuggestions);
	// const appDispatch = useDispatch<AppDispatch>();
	// const handleChangeWithDebounce = debounce(async (e) => {
	// 	handleAutocomplete(e);
	// }, 500);
	return (
		<div className="comparison_container">
			<Card>
				<CardHeader title="Click on two nodes to find their relationship" />
				<CardContent>
					{selectedNodes.first &&
						<Typography>
							{selectedNodes.first.name}
						</Typography>}

					{selectedNodes.second &&
						<Typography>
							{selectedNodes.second.name}
						</Typography>}
				</CardContent>
			</Card>
		</div >
	);
};
