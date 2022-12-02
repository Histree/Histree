import { Button, Card, CardActions, CardContent, CardHeader, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilterInfo, getRenderContent, setFilterInfo } from "../../stores";
import { isContentAvail } from "../../utils/utils";
import "./FilterCard.scss";

export const FilterCard = () => {
	const dispatch = useDispatch();
	const renderContent = useSelector(getRenderContent);
	const filterInfo = useSelector(getFilterInfo);
	const [startDate, setStartDate] = useState(filterInfo.bornBetween.startDate);
	const [endDate, setEndDate] = useState(filterInfo.bornBetween.endDate);

	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value);
	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value);

	const handleApplyFilters = () =>
		dispatch(setFilterInfo(
			{ filtered: startDate !== "" || endDate !== "", bornBetween: { startDate: startDate, endDate: endDate } }
		));

	const handleClear = () => {
		dispatch(setFilterInfo({ filtered: false, bornBetween: { startDate: "", endDate: "" } }))
		setStartDate("");
		setEndDate("")
	}

	return (
		<div className="filter-container">
			<Card>
				<CardHeader style={{ padding: '1em 0 0 1em', margin: 0 }} title="Filter" />
				{isContentAvail(renderContent) ?
					<>
						<CardContent>
							<div className="filter-title-container">
								<Typography>Born between</Typography>
							</div>
							<div className="filter-born-container">
								<div className="filter-input">
									<TextField
										type="date"
										label="Start"
										InputLabelProps={{ shrink: true }}
										value={startDate}
										onChange={handleStartDateChange}
									/>
								</div>
								<div className="filter-input">
									<TextField
										type="date"
										label="End"
										InputLabelProps={{ shrink: true }}
										value={endDate}
										onChange={handleEndDateChange}
									/>
								</div>
							</div>
						</CardContent>
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
