import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilterInfo, getRenderContent, setFilterInfo } from "../../stores";
import { isFilterEnabled } from "../../utils/filter";
import { isContentAvail } from "../../utils/utils";
import "./FilterCard.scss";
import { FilterDateRange } from "./FilterDateRange";
import { FilterSwitch } from "./FilterSwitch";
import { FilterText } from "./FilterText";

export const FilterCard = () => {
	const dispatch = useDispatch();
	const renderContent = useSelector(getRenderContent);
	const filterInfo = useSelector(getFilterInfo);
	const [bornBetweenStart, setBornBetweenStart] = useState(filterInfo.bornBetween.startDate);
	const [bornBetweenEnd, setBornBetweenEnd] = useState(filterInfo.bornBetween.endDate);
	const [diedBetweenStart, setDiedBetweenStart] = useState(filterInfo.diedBetween.startDate);
	const [diedBetweenEnd, setDiedBetweenEnd] = useState(filterInfo.diedBetween.endDate);
	const [searchTerm, setSearchTerm] = useState(filterInfo.searchTerm);

	const handleApplyFilters = () =>
		dispatch(setFilterInfo({ 
			filtered: isFilterEnabled(filterInfo), 
			bornBetween: { startDate: bornBetweenStart, endDate: bornBetweenEnd },
			diedBetween: { startDate: diedBetweenStart, endDate: diedBetweenEnd },
			searchTerm: searchTerm
		}));

	const handleClear = () => {
		dispatch(setFilterInfo({ 
			filtered: false,
			bornBetween: { startDate: "", endDate: "" }, 
			diedBetween: { startDate: "", endDate: ""},
			searchTerm: undefined
		}));
		setBornBetweenStart("");
		setBornBetweenEnd("");
		setDiedBetweenStart("");
		setDiedBetweenEnd("");
		setSearchTerm(undefined);
	}

	return (
		<div className="filter-container">
			<Card>
				<CardHeader style={{ padding: '1em 0 0 1em', margin: 0 }} title="Filter" />
				{isContentAvail(renderContent) ?
					<>
						<FilterDateRange
							title="Born between"
							startDate={bornBetweenStart}
							endDate={bornBetweenEnd}
							setStartDate={setBornBetweenStart}
							setEndDate={setBornBetweenEnd}
						/>
						<FilterDateRange
							title="Died between"
							startDate={diedBetweenStart}
							endDate={diedBetweenEnd}
							setStartDate={setDiedBetweenStart}
							setEndDate={setDiedBetweenEnd}
						/>
						<FilterText
							title="Contains term"
							value={searchTerm}
							setValue={setSearchTerm}
						/>
						<CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
							<Button onClick={handleClear}>Clear</Button>
							<Button onClick={handleApplyFilters}>Apply Filters</Button>
						</CardActions>
					</> :
					<CardContent>
						<Typography>No data detected. Please search for someone.</Typography>
					</CardContent>
				}

			</Card>
		</div>
	);
};
