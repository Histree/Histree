import { Button, Card, CardActions, CardContent, CardHeader, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilterInfo } from "../../stores";
import "./FilterCard.scss";

export const FilterCard = () => {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    }

    const handleApplyFilters = () => {
        console.log(startDate);
        console.log(endDate);
        dispatch(setFilterInfo({ bornBetween: { startDate: startDate, endDate: endDate } }))
    }

    return (
		<div>
			<Card>
				<CardHeader style={{ padding: '1em 0 0 1em', margin: 0 }} title="Filter" />
				<CardContent>
                    <div className="filter-title-container">
                        <Typography>Born between</Typography>
                    </div>
                    <div className="filter-born-container">
                        <div className="filter-input">
                            <TextField 
                                type="date" 
                                label="Start" 
                                InputLabelProps={{shrink: true}} 
                                value={startDate} 
                                onChange={handleStartDateChange} 
                            />
                        </div>
                        <div className="filter-input">
                            <TextField 
                                type="date" 
                                label="End" 
                                InputLabelProps={{shrink: true}} 
                                value={endDate} 
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardActions sx={{display: "flex", justifyContent: "flex-end"}}>
                    <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </CardActions>
			</Card>
		</div>
	);
};
